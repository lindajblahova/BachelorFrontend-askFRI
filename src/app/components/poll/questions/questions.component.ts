import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {QuestionService} from '../../../services/question.service';
import {IQuestion} from '../../../interfaces/IQuestion';
import {MatDialog} from '@angular/material/dialog';
import {DialogDeleteQuestionComponent} from '../../dialog/dialog-delete-question/dialog-delete-question.component';
import {TokenService} from '../../../services/token.service';
import {UserService} from '../../../services/user.service';
import {AnswersComponent} from './answers/answers.component';
import {MatSnackBar} from '@angular/material/snack-bar';;
import {AnswerService} from '../../../services/answer.service';

/** Component pre zobrazenie otazok v miestnosti - ma dalsie podkomponenty - answer-question a answers
 * @author Linda Blahova
 * @version 1.0
 * @since   2021-04-21
 */
@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  /** ViewChild sluzi pre trigger eventu v dietati, pouzite pri exportovani vysledkov
   * do excelu, pretoze vysledky anekty su v detskom komponente ale tlacidlo pre export
   * je v rodicovskom (tomto), v "action row" pre rozsirujuci sa panel
   */
  @ViewChild(AnswersComponent ) child: AnswersComponent;
  private _questions: IQuestion[] = [];
  private _answeredQuestions = [];

  /** Vstup z rodica - komponentu poll, ci je pouzivatel v miestnosti
   * prihlaseny ako jej autor alebo nie
   */
  /// INPUTS
  private _author = false;

  constructor(private questionService: QuestionService, private dialog: MatDialog, private router: Router,
              private  tokenService: TokenService, private userService: UserService, private answerService: AnswerService,
              private snackBar: MatSnackBar) {
  }

  /** Pri inicializacii sa podla toho, ci je pouzivatel v miestnosti ako autor, odosle ziadost
   *  pre ziskanie otazok v miesntosti - bud su to vsetky otazky miestnosti, alebo len tie aktivne
   * (v pripade ucastnika)
   * Nastaveny je refresh komponentu, ktory je pouzity, pokial bola pouzivatelom odoslana odpoved
   * na otazku
   * Komponent otazok sa automaticky neobnovuje, preto obsahuje aj tlacidlo na manualne obnovenie
   * zoznamu otazok, (napriklad keby autor nastavil dalsiu otazku viditelnu pre ucastnikov, aby bola
   * ucastnikom zobrazena, musia sa ucastnici bud prepnut medzi konverzaciou a anketami, alebo stlacit
   * tlacidlo pre obnovenie komponentu. Je to tak vytvorene preto, aby sa neposielali zbytocne requesty
   * na server, ked to nie je velmi potrebne)
   */
  ngOnInit(): void {
    if (this.author) {
      this.getRoomQuestions();
    }
    else {
      this.getAnsweredQuestions();
      this.getRoomActiveQuestions();
      this.answerService.refreshNeeded.subscribe(() => {
        this.getAnsweredQuestions();
      });
    }
  }

  /** Metoda pre ziskanie vsetkych otazok miestnosti, po ziskani otazok sa zabola metoda pre utriedenie.
   *  Ak nebolo mozne otazky nacitat, zobrazi sa prislusne upozornenie
   */
  getRoomQuestions(): void {
    this.questionService.getRoomQuestions( Number(this.tokenService.getRoomId())).subscribe(data => {
      this.questions = data;
      this.sortQuestions();
    }, error => {
      if (error === 404) {
        this.snackBar.open('Nepodarilo sa nájst otázky miestnosti!', 'x', {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-warn']
        });
      }
    });
  }

  /** Metoda pre ziskanie aktivnych otazok miestnosti, po ziskani aktivnych otazok sa zabola metoda pre utriedenie.
   *  Ak nebolo mozne otazky nacitat, zobrazi sa prislusne upozornenie
   */
  getRoomActiveQuestions(): void {
    this.questionService.getRoomActiveQuestions( Number(this.tokenService.getRoomId())).subscribe(data => {
      this.questions = data;
      this.sortQuestions();
    }, error => {
      if (error === 404) {
        this.snackBar.open('Nepodarilo sa nájst aktívne otázky miestnosti!', 'x', {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-warn']
        });
      }
    });
  }

  /** Metoda pre utriedenie otazok podla ID, od najnovsich po najstarsie
   * pouzita sortovacia funkcia
   * zdroj: https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
   */
  sortQuestions(): void {
    this.questions.sort((a, b) => {
      if (a.idQuestion < b.idQuestion) {
        return 1;
      }
      if (a.idQuestion > b.idQuestion) {
        return -1;
      }
      return 0;
    });
  }

  /** Metoda ktora pre danu miestnost a daneho pouzivatela odosle ziadost pre zistenie
   * zoznamu otazok, na ktore uz bola zaznamena odpoved pouzivatelom
   * Pokial je tento zoznam najdeny, do atributu answeredQuestions sa ulozi zoznam ID
   * zodpovedanych otazok pouzivatela. Ak sa data nepodarilo ziskat, zobrazi sa prislusne
   * upozornenie
   */
  getAnsweredQuestions(): void {
    this._answeredQuestions = [];
    this.userService.getAnsweredQuestions(Number(this.tokenService.getUserId()), Number(this.tokenService.getRoomId())).subscribe(data => {
      data.forEach(item => this.answeredQuestions.push(item.idQuestion));
    }, error => {
      if (error === 404) {
        this.snackBar.open('Nepodarilo sa načítať, ktoré otázky boli používateľom zodpovedané!', 'x', {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-warn']
        });
      }
    });
  }

  /** Metoda pre zmenu viditelnosti otazky pre ucastnikov miestnosti, odosle ziadost pre zmenu
   * viditelnosti. Pokial sa viditelnost nepodarilo upravit, pouzivatel je o tejto skutocnosti informovany
   * @param id
   */
  displayQuestionPublic(id: number): void {
    this.questionService.displayQuestion(id).subscribe(data => {}, error => {
      if (error === 404) {
        this.snackBar.open('Nepodarilo sa upraviť viditeľnosť otázky!', 'x', {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-warn']
        });
      }
    });
  }

  /** Metoda pre zmenu viditelnosti vysledkov otazky pre ucastnikov miestnosti, odosle ziadost pre zmenu
   * viditelnosti vysledkov. Pokial sa viditelnost vysledkov nepodarilo upravit, pouzivatel je o tejto
   * skutocnosti informovany
   * @param id
   */
  displayAnswersPublic(id: number): void {
    this.questionService.displayAnswers(id).subscribe(data => {}, error => {
      if (error === 404) {
        this.snackBar.open('Nepodarilo sa upraviť viditeľnosť odpovedí!', 'x', {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-warn']
        });
      }
    });
  }

  /** Metoda pre otvorenie dialogoveho okna pre zmazanie otazky, po zatvoreni dialogoveho okna sa
   * v pripade, ze bolo potvrdene zmatanie, odosle ziadost pre zmazanie otazky a nasledne sa zavola
   * metoda pre znovunacitanie komponentu. Pokial sa otazku nepodarilo vymazat, zobrazi sa prislusne
   * upozornenie
   * @param idQuestion
   */
  openDeleteDialog(idQuestion: number): void {
    const dialogRef = this.dialog.open(DialogDeleteQuestionComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result)
      {
        this.questionService.deleteQuestion(idQuestion).subscribe(data => {
          this.reloadComponent() ;
        }, error => {
          if (error === 404) {
            this.snackBar.open('Nepodarilo sa vymazať otázku!', 'x', {
              duration: 2000,
              panelClass: ['mat-toolbar', 'mat-warn']
            });
          }
        });
      }
    }, error => {
      this.snackBar.open('Neznámy error!', 'x', {
        duration: 2000,
        panelClass: ['mat-toolbar', 'mat-warn']
      });
  });
  }

  /** Funkcia pre export vysledkov ankety do excelu, zavola metodu potomka pre
   * export vysledkov, kedze potomok udrziava vysledky ankety
   */
  exportexcel(): void{
    this.child.exportexcel() ;
  }

  /** Metoda pre znovu nacitanie rodicovskeho komponentu, prebrata zo zdroja
   * zdroj: https://www.codegrepper.com/code-examples/typescript/angular+9+refresh+component+from+another+component
   */
  reloadComponent(): void {
    const currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  /// GETTRE A SETTRE
  get author(): boolean {
    return this._author;
  }

  @Input()
  set author(value: boolean) {
    this._author = value;
  }

  get answeredQuestions(): any[] {
    return this._answeredQuestions;
  }

  set answeredQuestions(value: any[]) {
    this._answeredQuestions = value;
  }
  get questions(): any[] {
    return this._questions;
  }

  set questions(value: any[]) {
    this._questions = value;
  }

}
