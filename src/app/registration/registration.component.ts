import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';

class UserService {
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
  error: string;

  constructor(private formBuilder: FormBuilder,
              private router: Router) {
  }

  // convenience getter for easy access to form fields
  get f(){
    return this.registerForm.controls;
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{8,}$')]]
    });
  }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    /*this.userService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/login'], { queryParams: { registered: true }});
        },
        error => {
          this.error = error;
          this.loading = false;
        });*/
  }

  getErrorMessage(registerFormControl): string {
    if (registerFormControl.hasError('required')) {
      return 'You must enter a value';
    } else if (registerFormControl.hasError('pattern')) {
      return 'Please enter password with ' +
        '<br> 1) Minimum 8 characters ' +
        '<br> 2) At least one capital letter ' +
        '<br> 2) At least one small letter';
    }

    return registerFormControl.hasError('email') ? 'Not a valid email' : '';
  }

}
