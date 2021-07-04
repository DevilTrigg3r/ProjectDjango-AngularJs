import { Directive } from '@angular/core';
import { NG_VALIDATORS, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appValidateLongitude]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: ValidateLongitudeDirective,
    multi: true
  }]
})
export class ValidateLongitudeDirective {

  constructor() { }

  validate(longitudeField: AbstractControl): { [key: string]: any} {
    let validateLongitude: boolean = false;

    if(longitudeField.value) {
      let value = longitudeField.value;
      if(isNaN(value) || value > 180 ||  value < -180) {
        validateLongitude = true;
      }
    } else {
      if(longitudeField.value != 0) {
        validateLongitude = true;
      }
    }

    return validateLongitude ? {"validate": validateLongitude} : null;
  }

}
