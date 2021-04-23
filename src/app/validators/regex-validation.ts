import {AbstractControl, ValidatorFn} from '@angular/forms';

/** Metoda sluzi pre validaciu vstupu pomocou zadaneho regex patternu,
 *  pouzite pri validacii vstupov formularov
 * @param forbiddenRegex
 * @return ak je validacia v poriadku, vrati null, inac vrati hodnotu vstupu
 */
export function regexFineFunction(forbiddenRegex: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const forbidden = forbiddenRegex.test(control.value);
    return forbidden ? null : { requiredRegex: {value: control.value}} ;
  };
}
