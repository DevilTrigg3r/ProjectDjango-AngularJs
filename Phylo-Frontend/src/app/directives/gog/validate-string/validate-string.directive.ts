import { Directive } from '@angular/core';
import { NG_VALIDATORS, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appValidateString]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: ValidateStringDirective,
    multi: true
  }]
})
export class ValidateStringDirective {

  constructor() { }

  validate(stringField: AbstractControl): { [key: string]: any} {
    let validateString: boolean = false;

    if(stringField?.value) {
      let regexPattern = /^[a-zA-Z ]+$/;
      let value = stringField.value;
      if(!regexPattern.test(value)) {
        validateString = true;
      }
    } else {
      validateString = true;
    }

    return validateString ? {"validate": validateString} : null;
  }

}
