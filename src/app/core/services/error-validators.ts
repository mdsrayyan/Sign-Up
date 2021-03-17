import {ErrorStateMatcher} from '@angular/material/core';
import {FormControl, FormGroupDirective, NgForm} from '@angular/forms';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control?.invalid && control?.touched);
    const invalidParent = !!(control?.parent?.invalid && control?.parent?.dirty && control?.parent?.hasError('isMatching'));

    return invalidCtrl || invalidParent;
  }
}

export class ConfirmPasswordStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidParent = !!(control?.parent?.invalid && control?.parent?.dirty && control?.parent?.hasError('notSame'));

    return  control?.touched && invalidParent;
  }
}
