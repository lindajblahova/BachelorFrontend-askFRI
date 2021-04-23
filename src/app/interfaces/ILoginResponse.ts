/** Predloha pre prijem dat po logine pouzivatela
 */
export interface ILoginResponse {
  token: string;
  id: number;
  role: string;
}
