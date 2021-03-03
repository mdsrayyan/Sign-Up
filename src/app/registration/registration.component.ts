import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {UserService} from '../core/services/user.service';


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

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private userService: UserService) {
  }

  // convenience getter for easy access to form fields
  get f(): { [p: string]: AbstractControl } {
    return this.registerForm.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{8,}$')]]
    });
  }

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
    }
  }

}
