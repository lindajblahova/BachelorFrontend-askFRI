/** Predloha pre odosielanie dat pre zmenu hesla pouzivatela
 */
export interface IUserPassword {
  idUser: number;
  oldPassword: string;
  newPassword: string;
}
