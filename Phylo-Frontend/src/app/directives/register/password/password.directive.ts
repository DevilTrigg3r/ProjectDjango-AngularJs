import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appPassword]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: PasswordDirective,
    multi: true
  }]
})
export class PasswordDirective {
  PASSWORD_REGEXP = /[a-zA-Z0-9]{8,}/;
  constructor() { }

  validate(formFieldToValidate: AbstractControl): { [key: string]: any } {
    let validInput: boolean = false;
    
    if (formFieldToValidate && formFieldToValidate.value) {
      validInput = this.PASSWORD_REGEXP.test(formFieldToValidate.value);
    }
    console.log(formFieldToValidate);
    return validInput ? null : { 'isNotCorrect': true };
  }
}
