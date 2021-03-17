import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {UserService} from '../core/services/user.service';
import {ConfirmPasswordStateMatcher, MyErrorStateMatcher} from '../core/services/error-validators';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  hide = true;
  confirmHide = true;
  confirmDisabled = true;
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  dataError: string;
  matcher = new MyErrorStateMatcher();
  confirmMatcher = new ConfirmPasswordStateMatcher();

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
      password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{8,}$')]],
      confirmPassword: ['']
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
    const confirmPassword = registerFormGroup && registerFormGroup.get('confirmPassword').value;

    if ((validFirstName && password.toLowerCase().indexOf(validFirstName.toLowerCase()) > -1 ||
      validLastName && password.toLowerCase().indexOf(validLastName.toLowerCase()) > -1)) {
      return {isMatching: true};
    } else if (password !== confirmPassword) {
      return {notSame: true };
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
      .subscribe(() => {
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
      return 'Password should have Minimum 8 characters, one capital and small letter';
    } else if (registerFormControl.hasError('email')) {
      return 'Not a valid email';
    } else if (this.registerForm.hasError('isMatching')) {
      return 'Password matches with your First Name or Last Name';
    } else if (this.registerForm.hasError('notSame')) {
      return 'Password did not match with one another';
    }
  }

}
