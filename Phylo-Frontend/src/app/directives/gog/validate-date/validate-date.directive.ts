import { Directive } from '@angular/core';
import { NG_VALIDATORS, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appValidateDate]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: ValidateDateDirective,
    multi: true
  }]
})
export class ValidateDateDirective {

  constructor() { }

  validate(dateField: AbstractControl): { [key: string]: any} {
    let validateDate: boolean = false;

    if(dateField.value) {
      let value = dateField.value;
      let regexPattern = /^\d{4}\-(?:0[1-9]|1[012])\-(?:0[1-9]|[12][0-9]|3[01])$/
      if(!regexPattern.test(value)) {
        validateDate = true;
      }
    } else {
      validateDate = true;
    }

    return validateDate ? {"validate": validateDate} : null;
  }

}
