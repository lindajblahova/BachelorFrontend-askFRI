import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AnswerService} from '../../../../services/answer.service';
import {IAnswer} from '../../../../interfaces/IAnswer';
import {IOptionalAnswer} from '../../../../interfaces/IOptionalAnswer';
import {QuestionService} from '../../../../services/question.service';
import * as XLSX from 'xlsx';
import {MatSnackBar} from '@angular/material/snack-bar';

/** Component pre zobrazenie vysledkov v otazke
 *  * pouziva XLSX z balika xlsx
 * @author Linda Blahova
 * @version 1.0
 * @since   2021-04-21
 */
@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.css']
})

export class AnswersComponent implements OnInit, OnDestroy {

  private _answers: IAnswer[] = [];
  private _optionalAnswers: IOptionalAnswer[] = [];
  private _answersCount: number;
  private _sliderA;
  private _sliderNumbers;
  private fileName = 'VysledkyAnkety.xlsx';
  private interval;

  /** Vstupy z rodica - komponentu question, ci je pouzivatel v miestnosti
   * prihlaseny ako jej autor, farba rodicovskej otazky a samotna otazka
   */
  /// INPUTS
  private _question;
  private _author;
  private _color: string;



constructor(private questionService: QuestionService, private answerService: AnswerService, private snackBar: MatSnackBar) {
  }

  /** Pri pociatocnom vytvoreni komponentu su nacitane odpovede a moznosti pre otazku, ktora je do komponentu vlozena
   * ako input od rodica
   * Kedze odpovede sa menia, ako ucastnici postupne odpovedaju na otazky, je pre odpovede nastaveny auto refresh
   * komponentu, pre casovy interval s funkciou setInterval. Obnovovaci interval je 5 sekund, kvoli odosielaniu mensieho
   * poctu requestov
   * zdroj: https://stackoverflow.com/questions/37116619/angular-2-setinterval-keep-running-on-other-component
   */
  ngOnInit(): void {
    this.answerService.refreshNeeded.subscribe( () => {
      this.getQuestionAnswers();
    });
    this.getQuestionAnswers();
    this.getOptionalAnswers();

    this.interval = setInterval(() => {this.getQuestionAnswers(); }, 5000);
  }

  /** Ked uz komponent nie je viac zobrazovany, je potrebne zrusit automaticke obnovovanie funkciou setInterval()
   * zdroj: https://stackoverflow.com/questions/37116619/angular-2-setinterval-keep-running-on-other-component
   */
  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  /** Metoda pre ziskanie odpovedi k otazke a ich ulozenie do pola answers
   * Pokial nebolo mozne najst otazku, vypise sa prislusne upozornenie
   */
  getQuestionAnswers(): void {
    this.answerService.getQuestionAnswers(this.question.idQuestion).subscribe(data => this.answers = data,
      error => {
        if (error === 404) {
          this.snackBar.open('Nepodarilo sa načítať odpovede k otázke', 'x', {
            duration: 2000,
            panelClass: ['mat-toolbar', 'mat-warn']
          });
        }
      });
  }

  /** Metoda pre ziskanie moznosti k otazke a ich ulozenie do pola optionalAnswers a nasledne utriedenie tychto odpovedi
   * od najstrarsich po najnovsie
   * Pokial je otazka typu posuvac, zavola sa metoda pre odpovede posuvaca
   * Pokial nebolo mozne najst otazku, vypise sa prislusne upozornenie
   */
  getOptionalAnswers(): void {
    this.questionService.getOptionalAnswers(this.question.idQuestion).subscribe(data => {
      this._optionalAnswers = data;
      if (this.question.type !== 3) {
        this._optionalAnswers.sort((a, b) => {
          if (a.idOptionalAnswer > b.idOptionalAnswer) {
            return 1;
          }
          if (a.idOptionalAnswer < b.idOptionalAnswer) {
            return -1;
          }
          return 0;
        });
      } else {
        this.sliderAnswers();
      }
    },     error => {
      if (error === 404) {
        this.snackBar.open('Nepodarilo sa načítať možnosti odpovede pre otázku', 'x', {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-warn']
        });
      }
    });
  }

  /** Metoda pre zobrazenie poctu odpovedi pre danu moznost
   * Metoda filtruje pole answers, podla zadaneho obsahu moznosti a napocita
   * do atributu answersCount, kolko krat sa tato odpoved v poli vyskytla
   * @param answerPar
   */
  showCount(answerPar: string): void {
      this.answersCount = 0;
      this.answers.filter(element => {
        if (element.content === answerPar) {
          this.answersCount += 1;
        }
      });
  }

  /** Metoda pre zobrazenie poctu odpovedi pre moznosti posuvaca (moznostami su cisla, nie string)
   * Metoda filtruje pole answers, podla zadaneho obsahu moznosti a napocita
   * do atributu answersCount, kolko krat sa tato odpoved v poli vyskytla
   * @param answerPar
   */
  showCountSlider(answerPar: number): void {
    this.answersCount = 0;
    this.answers.filter(element => {
      if (element.content ===  answerPar.toString()) {
        this.answersCount += 1;
      }
    });
  }

  /** Metoda pre vypocet moznosti posuvaca
   * Z pola optionalAmnswers (Obsahujuceho min, max a krok) sa tieto hodnoty ulozia do pola
   * sliderOptions ako cisla a nasledne sa cisla utriedia od najmensieho po najvacsie (
   * preto je pri vytvarani posuvaca podmienka, aby nebolo minimum vacsie ako krok, inak by
   * posuvac nefungoval spravne. Zoradenie podla ID nie vzdy fungovalo 100%)
   * nasledne sa do atributu sliderA vypocita pocet moznych odpovedi pri danych hodnotach
   * posuvaca a do atributu sliderNumbers sa ulozia vsetky mozne hodnoty, na ktore bolo mozne
   * pri otazke typu posuvac zaznamenat odpoved
   */
  sliderAnswers(): void {
    const sliderOptions = [];
    this.optionalAnswers.forEach(opt => {
      sliderOptions.push(Number(opt.content));
    });
    sliderOptions.sort((a, b) => {
      if (a > b) {
        return 1;
      }
      if (a < b) {
        return -1;
      }
      return 0;
    });
    this.sliderA = (sliderOptions[2] - sliderOptions[0]) /
       sliderOptions[1];
    this.sliderNumbers = [];
    for (let i = 0; i <= this.sliderA; i++) {
       this.sliderNumbers.push(i * sliderOptions[1]);
    }
  }

  /** Metoda pre nastavenie farby pozadia vysledkov ankety, podla farby rodicovskej otazky
   * @param id
   */
  getBackgroundColor(id: string): string {
    const idNumber = Number(id);
    let color = '#ffffff';
    switch (idNumber % 5) {
      case 1:
        color = 'rgba(83,179,255,0.3)';
        break;
      case 2:
        color = 'rgba(16, 255, 218, 0.3)';
        break;
      case 3:
        color = 'rgba(255,78,65,0.3)';
        break;
      case 4:
        color = 'rgba(235,112,177,0.3)';
        break;
      default:
        color = 'rgba(112,234,80,0.3)';
    }
    return color;
  }

  /** Metoda pre exportovanie otazky a jej vysledkov do suboru excel, pomocou balicka xlsx,
   * prebrate zo zdroja
   * zdroj: https://jsonworld.com/demo/how-to-export-data-to-excel-file-in-angular-application
   */
  exportexcel(): void {
    const date = new Date();
    this.fileName = 'Vysledky-' + this.question.content.substr(0, 10) + '-'
      + date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + '.xlsx';
    const element = document.getElementById('excel-table');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    XLSX.writeFile(workbook, this.fileName);
  }

  /// GETTRE A SETTRE
  get optionalAnswers(): IOptionalAnswer[] {
    return this._optionalAnswers;
  }

  set optionalAnswers(value: IOptionalAnswer[]) {
    this._optionalAnswers = value;
  }

  get color(): string {
    return this._color;
  }

  @Input()
  set color(value: string) {
    this._color = value;
  }

  get author() {
    return this._author;
  }

  @Input()
  set author(value) {
    this._author = value;
  }

  get question() {
    return this._question;
  }

  @Input()
  set question(value) {
    this._question = value;
  }
  get sliderNumbers() {
    return this._sliderNumbers;
  }

  set sliderNumbers(value) {
    this._sliderNumbers = value;
  }
  get sliderA() {
    return this._sliderA;
  }

  set sliderA(value) {
    this._sliderA = value;
  }
  get answersCount(): number {
    return this._answersCount;
  }

  set answersCount(value: number) {
    this._answersCount = value;
  }
  get answers(): any[] {
    return this._answers;
  }

  set answers(value: any[]) {
    this._answers = value;
  }

}
