import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationComponent } from './registration.component';
import {FormGroupDirective, ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {UserService} from '../core/services/user.service';
import {of} from 'rxjs';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  const RouterSpy = jasmine.createSpyObj(
    'Router',
    ['navigate']
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrationComponent ],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientModule],
      providers: [{ provide: Router, useValue: RouterSpy}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form group', () => {
    expect(component.registerForm).toBeTruthy();
    expect(component.registerForm.get('firstName').value).toBe('');
    expect(component.registerForm.get('lastName').value).toBe('');
    expect(component.registerForm.get('email').value).toBe('');
    expect(component.registerForm.get('password').value).toBe('');
  });

  it('should reset form if submitted successfully', () => {
    // dummy form group Directive to avoid undefined addControl function
    const formGroupDirective: FormGroupDirective = new FormGroupDirective([], []);
    const userService = TestBed.inject(UserService);
    const data = null;
    spyOn(userService, 'register').and.returnValue(of(data));
    component.onSubmit(formGroupDirective);
    expect(component.registerForm.get('firstName').value).toBe('');
  });

  it('should return if form is invalid', () => {
    const formGroupDirective: FormGroupDirective = new FormGroupDirective([], []);
    expect(component.onSubmit(formGroupDirective)).toBe(undefined);
  });

  it('should return proper error message when validated for required field', () => {
    component.registerForm.setValue({firstName: '', lastName: '', email: '', password: ''});
    expect(component.getErrorMessage(component.registerForm.get('firstName'))).toBe('You must enter a value');
    expect(component.getErrorMessage(component.registerForm.get('lastName'))).toBe('You must enter a value');
    expect(component.getErrorMessage(component.registerForm.get('email'))).toBe('You must enter a value');
    expect(component.getErrorMessage(component.registerForm.get('password'))).toBe('You must enter a value');
  });

  it('should return proper error message for password pattern', () => {
    component.registerForm.setValue({firstName: 'rayyan', lastName: 'Mahammad', email: 'abc@gmail.com', password: 'abcdefgh'});
    expect(component.getErrorMessage(component.registerForm.get('password'))).toBe('Please enter password with ' +
      '<br> 1) Minimum 8 characters ' +
      '<br> 2) At least one capital letter ' +
      '<br> 3) At least one small letter');
  });

  it('should return proper error message for password matches first name or last name', () => {
    component.registerForm.setValue({firstName: 'rayyan', lastName: 'Mahammad', email: 'abc@gmail.com', password: 'abcdRayyanefgh'});
    expect(component.getErrorMessage(component.registerForm.get('password'))).toBe('Password matches with your First Name or Last Name');
  });

  it('should return proper error message for non proper mail address', () => {
    component.registerForm.setValue({firstName: 'rayyan', lastName: 'Mahammad', email: 'abc@gmail@com', password: 'abcdefgh'});
    expect(component.getErrorMessage(component.registerForm.get('email'))).toBe('Not a valid email');
  });

  it('should return null if when checkedforValidity', () => {
    component.registerForm.setValue({firstName: 'rayyan', lastName: 'Mahammad', email: 'abc@gmail@com', password: 'abcdefgh'});
    expect(component.checkPasswordValidity(component.registerForm)).toBe(null);
  });

  it('should return isMatching error if when checkedforValidity', () => {
    component.registerForm.setValue({firstName: 'rayyan', lastName: 'Mahammad', email: 'abc@gmail@com', password: 'abcdRayyanefgh'});
    expect(component.checkPasswordValidity(component.registerForm)).toEqual({ isMatching: true });
  });

});

