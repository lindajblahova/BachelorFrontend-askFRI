/** Predloha pre odosielanie a prijem dat pouzivatela
 */
export interface IUser {
  idUser: number;
  firstname: string;
  surname: string;
  email: string;
  password: string;
  role: string;
}
