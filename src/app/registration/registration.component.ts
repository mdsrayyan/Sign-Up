import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {UserService} from '../core/services/user.service';
import {ErrorStateMatcher} from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control?.invalid && control?.touched);
    const invalidParent = !!(control?.parent?.invalid && control?.parent?.dirty && control?.parent?.hasError('isMatching'));

    return invalidCtrl || invalidParent;
  }
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  hide = true;
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  dataError: string;
  matcher = new MyErrorStateMatcher();

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private userService: UserService) {
  }

  /**
   * @summary gets the form controls of a given form
   * @returns list of controls in form group
   */
  get f(): { [p: string]: AbstractControl } {
    return this.registerForm.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * @summary initializes and custom validators are added to the form group
   */
  initializeForm(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{8,}$')]]
    }, {validators: this.checkPasswordValidity});
  }

  /**
   * @summary checks the validity of form group if password matches firstName or LastName
   * @param registerFormGroup - formGroup element
   * @returns custom validator if condition matches
   */
  checkPasswordValidity(registerFormGroup: FormGroup): { [key: string]: boolean } {
    const validFirstName = registerFormGroup && registerFormGroup.get('firstName').valid && registerFormGroup.get('firstName').value;
    const validLastName = registerFormGroup && registerFormGroup.get('lastName').valid && registerFormGroup.get('lastName').value;
    const password = registerFormGroup && registerFormGroup.get('password').value;
    if ((validFirstName && password.toLowerCase().indexOf(validFirstName.toLowerCase()) > -1 ||
      validLastName && password.toLowerCase().indexOf(validLastName.toLowerCase()) > -1)) {
      return {isMatching: true};
    }
    return null;
  }

  /**
   * @summary Invokes register method to sign up the user
   * @param formDirective - This is responsible for binding form group to DOM
   */
  onSubmit(formDirective: FormGroupDirective): void {
    this.submitted = true;
    this.loading = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.userService.register(this.registerForm.value)
      .pipe(first())
      .subscribe((data) => {
        alert('Form submitted successfully');
        formDirective.resetForm();
        this.registerForm.reset();
        this.loading = false;
      }, error => {
        this.dataError = error;
        this.loading = false;
      });
  }

  /**
   * @summary returns error message based on conditions
   * @param registerFormControl - takes form control as input
   * @returns error text that has to be displayed
   */
  getErrorMessage(registerFormControl): string {
    if (registerFormControl.hasError('required')) {
      return 'You must enter a value';
    } else if (registerFormControl.hasError('pattern')) {
      return 'Please enter password with ' +
        '<br> 1) Minimum 8 characters ' +
        '<br> 2) At least one capital letter ' +
        '<br> 3) At least one small letter';
    } else if (registerFormControl.hasError('email')) {
      return 'Not a valid email';
    } else if (this.registerForm.hasError('isMatching')) {
      return 'Password matches with your First Name or Last Name';
    }
  }

}
