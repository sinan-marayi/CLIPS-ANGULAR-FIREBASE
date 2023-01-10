import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class RegisterValidator {
  static match(control: string, confirmControl: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      let firstControl = group.get(control);
      let secondControl = group.get(confirmControl);

      if (!firstControl || !secondControl) {
        return { ControlNotFound: true };
      }

      const error =
        firstControl.value === secondControl.value ? null : { noMatch: true };
      secondControl.setErrors(error);
      return error;
    };
  }
}
