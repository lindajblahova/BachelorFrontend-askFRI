import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {AnswerService} from '../../../../services/answer.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {IQuestion} from '../../../../interfaces/IQuestion';
import {QuestionService} from '../../../../services/question.service';
import {IOptionalAnswer} from '../../../../interfaces/IOptionalAnswer';
import {MatSnackBar} from '@angular/material/snack-bar';
import {IAnswer} from '../../../../interfaces/IAnswer';
import {TokenService} from '../../../../services/token.service';

/** Component pre zobrazenie formularov pre odoslanie odpovede k otazke
 * @author Linda Blahova
 * @version 1.0
 * @since   2021-04-21
 */
@Component({
  selector: 'app-answer-question',
  templateUrl: './answer-question.component.html',
  styleUrls: ['./answer-question.component.css']
})
export class AnswerQuestionComponent implements OnInit {

  private _optionalAnswers: IOptionalAnswer[] = [];

  // atributy pre posuvac
  private _valuesSlider = [];
  private _min: number;
  private _max: number;
  private _step: number;
  private _sliderValue: string;

  // atributy pre radio
  private _radioValue: string;

  // atributy pre checkbox
  private _checkFormChecked: boolean[];
  private _answersToSend: IAnswer[] = [];

  /** Vstupy z rodica - komponentu question, ci je pouzivatel v miestnosti
   * prihlaseny ako jej autor, farba rodicovskej otazky a samotna otazka
   */
  /// INPUTS
  private _question: IQuestion;
  private _author: boolean;
  private _color: string;

  private _answerForm: FormGroup = this.formBuilder.group({
    content:  ['']
  });

  constructor(private questionService: QuestionService, private answerService: AnswerService,
              private formBuilder: FormBuilder, private snackBar: MatSnackBar, private tokenService: TokenService) { }

  /** Na zaciatku sa nacitaju moznosti k otazke a pole pre zodpovedane checkboxy
   * sa naplni hodnotami false (nezaskrtnute)
   */
  ngOnInit(): void {
    this.getOptionalAnswers();
    this.checkFormChecked = new Array(this._optionalAnswers.length).fill(false);
  }

  /** Metoda pre ziskanie moznosti k otazke, moznosti sa v pripade uspesneho nacitania bud rovno zoradia
   * podla id, alebo v pripade posuvaca sa tieto hodnoty najprv prehodia na cisla a ulozia do pomocneho pola,
   * kde sa zoradia od najmensieho po najvacsie a nasledne sa nastavia ako hodnoty min max a step pre zobrazenie
   * posuvaca v html
   * Pokial nebolo mozne nacitat moznosti k otazke, vypise sa prislusne upozornenie
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
      }
      if (this.question.type === 3)
      {
        this.optionalAnswers.forEach(ans => {
          this._valuesSlider.push(Number(ans.content));
        });
        this._valuesSlider.sort((a, b) => {
          if (a > b) {
            return 1;
          }
          if (a < b) {
            return -1;
          }
          return 0;
        });
        this._min = this._valuesSlider[0];
        this._max = this._valuesSlider[2];
        this._step = this._valuesSlider[1];
      }
    },     error => {
      if (error === 404) {
        this.snackBar.open('Nepodarilo sa načítať možnosti otázky', 'x', {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-warn']
        });
      }
    } );
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

  /** Metoda pre vytovrenie odpovede pre formular typu posuvac
   * Pokial bola zvolena hodnota posuvaca, prida sa v prislusnom formate do pola
   * answersToSend a zavola sa metoda createBasicAnswer()
   */
  createSliderAnswer(): void {
    if (this.sliderValue !== null) {
      this._answersToSend.push({idAnswer: 0, idQuestion: this.question.idQuestion,
        content: this.sliderValue});
      this.createBasicAnswer();
    }
  }

  /** Metoda pre vytovrenie odpovede pre formular typu vyzber viacerych moznosti
   * Pokial bola zvolena aspon jedna hodnota z vyberu, zvolena hodnota/hodnoty sa
   * prida(ju) v prislusnom formate do pola
   * answersToSend a zavola sa metoda createBasicAnswer()
   */
  createCheckboxAnswer(): void {
    if (this.checkFormChecked.find(value => value === true)) {
      for (let i = 0; i < this.checkFormChecked.length; i++) {
        if (this.checkFormChecked[i] === true) {
          this._answersToSend.push({idAnswer: 0, idQuestion: this.question.idQuestion,
            content: this._optionalAnswers[i].content});
        }
      }
      this.createBasicAnswer();
    }
  }

  /** Metoda pre vytovrenie odpovede pre formular typu vyber jednej moznosti
   * Pokial bola zvolena moznost, prida sa v prislusnom formate do pola
   * answersToSend a zavola sa metoda createBasicAnswer()
   */
  createRadioAnswer(): void {
    if (this.radioValue !== null) {
      this._answersToSend.push({idAnswer: 0, idQuestion: this.question.idQuestion,
        content: this.radioValue});
      this.createBasicAnswer();
    }
  }

  /** Metoda pre vytovrenie odpovede pre formular typu otvorena otazka
   * Pokial nebol obsah odpovede prazdny, prida sa v prislusnom formate do pola
   * answersToSend a zavola sa metoda createBasicAnswer()
   */
  createCustomAnswer(): void {
    if (this.answerForm.get('content').value.trim() !== '') {
      this._answersToSend.push({idAnswer: 0, idQuestion: this.question.idQuestion,
        content: this.answerForm.get('content').value.trim()});
      this.createBasicAnswer();
    }
  }

  /** Metoda odosle ziadost pre odoslanie odpovede na otazku a pokial bola odpoved uspesne ulozena,
   * zobrazi sa upozornenie o ulozeni a refreshne sa rodicovsky komponent, co sposobi skrytie formularu
   * pre odpoved na otazku
   * pri odoslani odpovede sa po ulozeni odpovede/odpovedi zaroven vytvori zaznam o pouzivatelom
   * zodpovedanej otazke.
   * Ak nebolo odoslanie odpovede uspesne, zobrazi sa prislusne upozornenie
   */
  createBasicAnswer(): void {
      this.answerService.saveAnswer(this._answersToSend, Number(this.tokenService.getUserId())).subscribe(
        response => {
          this.snackBar.open(response.message, 'x', {
            duration: 2000
          });
        },     error => {
          if (error === 406) {
            this.snackBar.open('Nepodarilo sa odoslať odpoveď', 'x', {
              duration: 2000,
              panelClass: ['mat-toolbar', 'mat-warn']
            });
          } else if (error === 404) {
            this.snackBar.open('Nepodarilo sa odoslať odpoveď, otázka nebola nájdená', 'x', {
              duration: 2000,
              panelClass: ['mat-toolbar', 'mat-warn']
            });
          }
        } );
      this._answersToSend = [];
  }

  /// GETTRE A SETTRE
  get step(): number {
    return this._step;
  }

  set step(value: number) {
    this._step = value;
  }
  get max(): number {
    return this._max;
  }

  set max(value: number) {
    this._max = value;
  }
  get min(): number {
    return this._min;
  }

  set min(value: number) {
    this._min = value;
  }
  get optionalAnswers(): IOptionalAnswer[] {
    return this._optionalAnswers;
  }

  set optionalAnswers(value: IOptionalAnswer[]) {
    this._optionalAnswers = value;
  }
  //
  // @Output()
  // get questionWasAnswered(): EventEmitter<number> {
  //   return this._questionWasAnswered;
  // }
  //
  // set questionWasAnswered(value: EventEmitter<number>) {
  //   this._questionWasAnswered = value;
  // }

  get answerForm(): FormGroup {
    return this._answerForm;
  }

  set answerForm(value: FormGroup) {
    this._answerForm = value;
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
  get checkFormChecked() {
    return this._checkFormChecked;
  }

  set checkFormChecked(value) {
    this._checkFormChecked = value;
  }
  get radioValue() {
    return this._radioValue;
  }

  set radioValue(value) {
    this._radioValue = value;
  }
  get sliderValue(): string {
    return this._sliderValue;
  }

  set sliderValue(value: string) {
    this._sliderValue = value;
  }

}
