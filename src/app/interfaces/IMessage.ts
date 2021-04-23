/** Predloha pre odosielanie a prijem dat spravy
 */
export interface IMessage {
  idMessage: number;
  idRoom: number;
  content: string;
}

