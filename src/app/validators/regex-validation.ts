import {AbstractControl, ValidatorFn} from '@angular/forms';
import {IRoom} from '../interfaces/IRoom';
import {Observable, Subscription} from 'rxjs';

export function regexFineFunction(forbiddenRegex: RegExp): ValidatorFn {

  return (control: AbstractControl): {[key: string]: any} | null => {
    const forbidden = forbiddenRegex.test(control.value);
    return forbidden ? null : { requiredRegex: {value: control.value}} ;
  };
}

export function passscodeAlreadyExist(roomPasscode: number, existingPasscodes: IRoom[]): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const forbidden = existingPasscodes.find(room => {
      return room.roomPasscode === roomPasscode;
    });
    return forbidden === null ? null : { passcodeForbidden: {value: control.value}} ;
  };
}
