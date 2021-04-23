/** Predloha pre odosielanie a prijem dat miestnosti
 */
export interface IRoom {
  idRoom: number;
  idOwner: number;
  roomName: string;
  roomPasscode: string;
  active: boolean;
}
