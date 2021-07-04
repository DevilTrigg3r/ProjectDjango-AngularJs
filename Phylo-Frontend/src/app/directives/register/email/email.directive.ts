import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appEmail]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: EmailDirective,
    multi: true
  }]
})
export class EmailDirective {
  EMAIL_REGEXP = /[a-zA-Z0-9\.]+@[a-zA-Z]+\.[a-zA-Z]{2,4}/;
  
  constructor() { }

  validate(formFieldToValidate: AbstractControl): { [key: string]: any } {
    let validInput: boolean = false;
    if (formFieldToValidate && formFieldToValidate.value) {
      validInput = this.EMAIL_REGEXP.test(formFieldToValidate.value);
    }
    return validInput ? null : { 'isNotCorrect': true };
  }

}
