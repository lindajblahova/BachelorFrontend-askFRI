/** Predloha pre odosielanie a prijem dat otazky
 * typy otazok:
 * otvorena = 0
 * vyber jednej = 1
 * vyber niekolkych = 2
 * posuvac = 3
 */
export interface IQuestion {
  idQuestion: number;
  idRoom: number;
  type: number;
  content: string;
  questionDisplayed: boolean;
  answersDisplayed: boolean;
}

/*

}*/

