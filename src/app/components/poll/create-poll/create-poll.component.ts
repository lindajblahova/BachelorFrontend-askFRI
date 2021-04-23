import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {QuestionService} from '../../../services/question.service';
import {ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {TokenService} from '../../../services/token.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {IOptionalAnswer} from '../../../interfaces/IOptionalAnswer';

/** Predloha pre moznost vytvaranej otazky, pouzita ak sa jedna o otazku
 * s moznostami
 */
export interface OptionalAnswer {
  name: string;
}

/** Component pre vytvorenie otazky/ankety v miestnosti
 * @author Linda Blahova
 * @version 1.0
 * @since   2021-04-21
 */
@Component({
  selector: 'app-create-poll',
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.css']
})
export class CreatePollComponent implements OnInit {

  // hodnota zo selectu typu otazky
  private _selectedType: number;
  // hodnoty slidera
  private _max = 100;
  private _min = 0;
  private _step = 1;
  private _optionalAnswers: OptionalAnswer[] = [];
  private _optionalAnswersToSend: IOptionalAnswer[] = [];
  // oddelovac pre vytvaranie moznosti pre otazku
  readonly separatorKeysCodes: number[] = [ENTER];

  private _room: number;

  private _createQuestionForm: FormGroup = this.formBuilder.group({
    questionType: ['', [Validators.required]],
    content: ['', [Validators.required]]
  });

  private _sliderForm: FormGroup = this.formBuilder.group({
    min: [this.min, [Validators.required]],
    max: [this.max, [Validators.required]],
    step: [this.step, [Validators.required]],
  });

  constructor( private questionService: QuestionService, private formBuilder: FormBuilder, private router: Router,
               private tokenService: TokenService, private snackBar: MatSnackBar) { }

  /** Vybrany typ sa na zaciatku nastavi na neplatnu hodnotu a zisti sa id miesntosti,
   * v ktorej sa autor nachadza
   */
  ngOnInit(): void {
    this.selectedType = -1;
    this._room = Number(this.tokenService.getRoomId());
  }

  /** Metoda pre vytvorenie otazky. Odosle sa ziadost pre vytvorenie otazky, pokial bola otazka vytvorena
   * a jej typ bol "posuvac", ako moznosti sa pridaju hodnoty posuvaca - min max a hodnota kroku.
   * Nasledne sa pole optionalAnswers, ktore obsahuje len nazvy moznosti premapuje na pole ktoreo obsahuje
   * aj zvysne potrebne udaje a odosle sa ziadost pre ulozenie tychto moznosti k otazke. Pokial nebolo mozne akciu vykonat,
   * zobrazi sa prislusne upozornenie
   * Pokial bola otazka vytvorena, zobrazi sa pripomienkove upozornenie, pre zobrazenie viditelnosti otazky
   * a zavola sa reload komponentu
   */
  createQuestion(): void {
      this.questionService.saveQuestion({idQuestion: 0, idRoom: this._room,
        type: this.createQuestionForm.get('questionType').value, content: this.createQuestionForm.get('content').value.trim(),
        questionDisplayed: false, answersDisplayed: false}).subscribe(
        response => {
          if (response.type === 3)
          {
            this.optionalAnswers.push({name: '' + Number(this.sliderForm.get('min').value)});
            this.optionalAnswers.push({name: '' +  Number(this.sliderForm.get('max').value )});
            this.optionalAnswers.push({name: '' +  Number(this.sliderForm.get('step').value)});
          }
          let i;
          for (i = 0; i < this.optionalAnswers.length; i++) {
            this._optionalAnswersToSend.push({idOptionalAnswer: 0, idQuestion: response.idQuestion,
              content: this.optionalAnswers[i].name});
          }
          if (response.type !== 0) {
            this.questionService.saveOptionalAnswer(this._optionalAnswersToSend).subscribe( response1 => {
              }, error1 => {
                if (error1 === 406) {
                  this.snackBar.open('Nepodarilo sa vytvoriť možnosť odpovede!', 'x', {
                    duration: 2000,
                    panelClass: ['mat-toolbar', 'mat-warn']
                  });
                }
              }
            );
          }
          this.snackBar.open('Otázka bola vytvorená. Pre zobrazenie otázky účastníkom aktivujte jej viditeľnosť!', 'x', {
            duration: 2000,
            panelClass: ['mat-toolbar', 'mat-accent']
          });
        },
        error => {
          if (error === 406) {
            this.snackBar.open('Nepodarilo sa vytvoriť otázku!', 'x', {
              duration: 2000,
              panelClass: ['mat-toolbar', 'mat-warn']
            });
          }
        });

      this.createQuestionForm.reset();
      this.reloadComponent();
      this.reloadComponent();
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

  /** Nastavene atributu vybrateho typu otazky
   * @param type
   */
  select(type: number): void{
    this.selectedType = type;
  }

  /** Metoda pre pridanie moznosti k otazke do pola optionalAnswers, pomocou "Chip", prebrate zo zdroja
   * zdroj: https://material.angular.io/components/chips/overview
   * @param event
   */
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
     this.optionalAnswers.push({name: value.trim()});
    }
    if (input) {
      input.value = '';
    }
  }

  /** Metoda pre odobratie moznosti k otazke z pola optionalAnswers, pomocou "Chip", prebrate zo zdroja
   * zdroj: https://material.angular.io/components/chips/overview
   * @param item
   */
  remove(item: OptionalAnswer): void {
    const index = this.optionalAnswers.indexOf(item);

    if (index >= 0) {
      this.optionalAnswers.splice(index, 1);
    }
  }

  /** Metoda pre validaciu kroku posuvaca, (max - min) musi byt delitelne krokom, pre spravne
   * zobrazenie krokov v posuvaci
   */
  getSliderFormStepValidation(): number {
    return (Number(this.sliderForm.get('max').value) - Number(this.sliderForm.get('min').value)) %
      Number(this.sliderForm.get('step').value);
  }

  // GETTRE A SETTRE
  get optionalAnswers(): OptionalAnswer[] {
    return this._optionalAnswers;
  }

  set optionalAnswers(value: OptionalAnswer[]) {
    this._optionalAnswers = value;
  }
  get sliderForm(): FormGroup {
    return this._sliderForm;
  }

  set sliderForm(value: FormGroup) {
    this._sliderForm = value;
  }
  get createQuestionForm(): FormGroup {
    return this._createQuestionForm;
  }

  set createQuestionForm(value: FormGroup) {
    this._createQuestionForm = value;
  }
  get step(): number {
    return this._step;
  }

  set step(value: number) {
    this._step = value;
  }
  get min(): number {
    return this._min;
  }

  set min(value: number) {
    this._min = value;
  }
  get max(): number {
    return this._max;
  }

  set max(value: number) {
    this._max = value;
  }
  get selectedType(): number {
    return this._selectedType;
  }

  set selectedType(value: number) {
    this._selectedType = value;
  }
  get room(): number {
    return this._room;
  }

  set room(value: number) {
    this._room = value;
  }
}
