import { Directive } from '@angular/core';
import { NG_VALIDATORS, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appValidateLatitude]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: ValidateLatitudeDirective,
    multi: true
  }]
})
export class ValidateLatitudeDirective {

  constructor() { }

  validate(latitudeField: AbstractControl): { [key: string]: any} {
    let validateLatitude: boolean = false;

    if(latitudeField.value) {
      let value = latitudeField.value;
      if(isNaN(value) || value > 90 ||  value < -90) {
        validateLatitude = true;
        console.log("aaaa")
      }
    } else {
      if(latitudeField.value != 0) {
        validateLatitude = true;
      }
    }

    return validateLatitude ? {"validate": validateLatitude} : null;
  }

}
