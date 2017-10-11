import { AuthService, RegistrationUser, UserCredentials, User, Role } from './auth.service';
import { inject, TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';

import { Store } from '../../../../../app/store';
import { AuthInterceptor } from '../../interceptors/auth/auth.interceptor';
import { Router } from '@angular/router';
import createSpy = jasmine.createSpy;

const okResponse = { status: 200, statusText: 'OK' };

const credentials: UserCredentials = {
  email: 'ericsnowden@nsa.com',
  password: 'allyourbasearebelongtous'
};

const currentUser: User = {
  first_name: 'Eric',
  last_name: 'Snowden',
  email: '',
  roles: ['patient']
};

describe('Auth Service', () => {
  let service: AuthService;
  let http: HttpClient;
  let store: Store;
  let localStorage: LocalStorageService;
  let MockRouter;

  beforeEach(() => {
    MockRouter = {
      navigate: createSpy('navigate')
    };

    const bed = TestBed.configureTestingModule({
      providers: [
        AuthService,
        HttpClient,
        Store,
        LocalStorageService,
        { provide: Router, useValue: MockRouter },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        }
      ],
      imports: [
        HttpClientTestingModule,
        LocalStorageModule.withConfig({
          prefix: 'app',
          storageType: 'localStorage'
        })
      ]
    });
    http = bed.get(HttpClient);
    service = bed.get(AuthService);
    store = bed.get(Store);
    localStorage = bed.get(LocalStorageService);
  });

  it('should get a status of true when registering a user', inject([HttpTestingController], (httpMock: HttpTestingController) => {
    // Setup
    const user: RegistrationUser = {
      role: 'patient',
      first_name: 'Bob',
      last_name: 'Marley',
      email: '',
      password: '',
      accepted_terms: true
    };

    service.registerUser(user)
      .subscribe((result: any) => {
        expect(result.status).toBe(true);
      });

    const req = httpMock.expectOne('register');
    req.flush({ status: true }, okResponse);

    httpMock.verify();
  }));

  it('should get a token when signing in a user', inject([HttpTestingController], (httpMock: HttpTestingController) => {
    // Setup
    const token = 'p4ti3nt';
    spyOn(localStorage, 'set');

    // Act & Assert
    service.loginUser(credentials).subscribe((res: any) => {

      expect(res.token).toBe(token);
      expect(localStorage.set).toHaveBeenCalled();
    });

    const req = httpMock.expectOne('login');
    req.flush({ status: true, token: token }, okResponse);
  }));

  it('should save user\'s information when fetching current user', inject([HttpTestingController], (httpMock: HttpTestingController) => {
    // Setup
    const token = 'p4ti3nt';
    localStorage.set('token', token);
    spyOn(store, 'set');

    // Act & Assert
    service.fetchCurrentUser();
    const req = httpMock.expectOne('fetchCurrentUser');
    req.flush({ status: true, user: currentUser }, okResponse);

    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    expect(store.set).toHaveBeenCalledWith('user', currentUser);

  }));

  it('interceptor should redirect the user to the login page if user has expired token.',
    inject([HttpTestingController], (httpMock: HttpTestingController) => {
    // Setup
    const token = 'p4ti3nt expired';
    localStorage.set('token', token);
    spyOn(store, 'set');

    // Act & Assert
    service.fetchCurrentUser();

    const req = httpMock.expectOne('fetchCurrentUser');
    req.flush({ status: false }, { status: 401, statusText: 'UNAUTHORIZED' }); // we get a 401 backend response for invalid token

    expect(store.set).not.toHaveBeenCalled();
    expect(MockRouter.navigate).toHaveBeenCalledWith(['/login']);
  }));

});
