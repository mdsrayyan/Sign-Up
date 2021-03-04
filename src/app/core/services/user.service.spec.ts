import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../../environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService
      ]
    });
    // Instantaites HttpClient, HttpTestingController and EmployeeService
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(UserService);
  });

  afterEach(() => {
    httpTestingController.verify(); // Verifies that no requests are outstanding.
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add form details', () => {
    const userData = {firstName: 'rayyan', lastName: 'Mahammad', email: 'abc@gmail.com', password: 'abcdefgh'};

    service.register(userData).subscribe(
      data => expect(data).toEqual(null, 'should save successfully'),
      fail
    );

    // addEmploye should have made one request to POST employee
    const url = environment.baseURL + '/users';
    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(userData);

    // Expect server to return the employee after POST
    const expectedResponse = new HttpResponse({ status: 200, body: null });
    req.event(expectedResponse);
  });

});
