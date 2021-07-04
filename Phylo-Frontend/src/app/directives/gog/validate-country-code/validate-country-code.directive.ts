import { Directive } from '@angular/core';
import { NG_VALIDATORS, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appValidateCountryCode]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: ValidateCountryCodeDirective,
    multi: true
  }]
})
export class ValidateCountryCodeDirective {

  constructor() { }

  validate(countryCodeField: AbstractControl): { [key: string]: any} {
    let validateCountryCode: boolean = false;

    if(countryCodeField?.value) {
      let value = countryCodeField.value;
      if(!isNaN(value) || value.length != 2) {
        validateCountryCode = true;
      }
    } else {
      validateCountryCode = true;
    }

    return validateCountryCode ? {"validate": validateCountryCode} : null;
  }

}
