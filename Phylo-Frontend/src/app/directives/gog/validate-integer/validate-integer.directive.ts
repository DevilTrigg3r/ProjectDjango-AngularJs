import { Directive } from '@angular/core';
import { NG_VALIDATORS, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appValidateInteger]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: ValidateIntegerDirective,
    multi: true
  }]
})
export class ValidateIntegerDirective {

  constructor() { }

  validate(specieIdField: AbstractControl): { [key: string]: any} {
    let validateSpecieId: boolean = false;

    if(specieIdField?.value) {
      let regexPattern = /^[0-9]+$/;
      let value = specieIdField.value;
      if(!regexPattern.test(value)) {
        validateSpecieId = true;
      }
    } else {
      validateSpecieId = true;
    }

    return validateSpecieId ? {"validate": validateSpecieId} : null;
  }

}
