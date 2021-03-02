import {AbstractControl, ValidatorFn} from '@angular/forms';

export function regexFineFunction(forbiddenRegex: RegExp): ValidatorFn {

  return (control: AbstractControl): {[key: string]: any} | null => {
    const forbidden = forbiddenRegex.test(control.value);
    return forbidden ? null : { forbiddenRegex: {value: control.value}} ;
  };
}
