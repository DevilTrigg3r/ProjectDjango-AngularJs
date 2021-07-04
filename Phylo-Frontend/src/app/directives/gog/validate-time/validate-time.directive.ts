import { Directive } from '@angular/core';
import { NG_VALIDATORS, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appValidateTime]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: ValidateTimeDirective,
    multi: true
  }]
})
export class ValidateTimeDirective {

  constructor() { }

  validate(timeField: AbstractControl): { [key: string]: any} {
    let validateTime: boolean = false;

    if(timeField?.value) {
      let regexPattern = /(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)/;
      let value = timeField.value;
      if(!regexPattern.test(value)) {
        validateTime = true;
      }
    } else {
      validateTime = true;
    }

    return validateTime ? {"validate": validateTime} : null;
  }

}
