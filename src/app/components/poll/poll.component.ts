import {Component, Input, OnInit} from '@angular/core';

/** Component pre ankety v miestnosti - ma dalsie podkomponenty - create poll a questions
 * @author Linda Blahova
 * @version 1.0
 * @since   2021-04-21
 */
@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css']
})
export class PollComponent {

  // urcuje co je predvolene zobrazene po nacitani komponentu (zoznam otazok)
  private _displayed: string = 'questionList';

  /** Vstup z rodica - komponentu room, ci je pouzivatel v miestnosti
   * prihlaseny ako jej autor alebo nie
   */
  /// INPUTS
  private _author = false;

  /** Metoda pre zobrazenie dotaznika pre vytvorenie novej otazky
   */
  newQuestion(): void {
    this.displayed = 'question';
  }

  /** Metoda pre zobrazenie zoznamu otazok danej miestnosti
   */
  showQuestions(): void {
    this.displayed = 'questionList';
  }

  /// GETTRE A SETTRE
  get author(): boolean {
    return this._author;
  }

  @Input()
  set author(value: boolean) {
    this._author = value;
  }

  get displayed(): string {
    return this._displayed;
  }

  set displayed(value: string) {
    this._displayed = value;
  }

}
