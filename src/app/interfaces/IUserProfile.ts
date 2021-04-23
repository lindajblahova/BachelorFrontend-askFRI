/** Predloha pre prijem niektorych dat pouzivatela (neobsahuje heslo)
 */
export interface IUserProfile {
  idUser: number;
  firstname: string;
  surname: string;
  email: string;
  role: string;
}
