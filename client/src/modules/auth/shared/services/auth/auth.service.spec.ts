import { AuthService, RegistrationUser, UserCredentials, User, Role } from './auth.service';
import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';

import { Store } from '../../../../../app/store';

export function createResponse(body) {
  return Observable.of(
    new HttpResponse({ body: JSON.stringify(body) })
  );
}

export class MockHttp {
  post() {
    return createResponse({});
  }

  get() {
    return createResponse({});
  }
}

const credentials: UserCredentials = {
  email: 'ericsnowden@nsa.com',
  password: 'allyourbasearebelongtous',
  remain_signed_in: true,
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

  beforeEach(() => {
    const bed = TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpClient, useClass: MockHttp },
        Store,
        LocalStorageService
      ],
      imports: [
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

  it('should get a status of true when registering a user', () => {
    // Setup
    const user: RegistrationUser = {
      role: 'patient',
      first_name: 'Bob',
      last_name: 'Marley',
      email: '',
      password: '',
      accepted_terms: true
    };
    // Act & Assert
    service.registerUser(user)
      .subscribe((result: any) => {
        expect(result.status).toBe(200);
      });
  });

  it('should get a token when signing in a user', () => {
    // Setup
    const successToken = { token: 'p4ti3nt' };
    spyOn(http, 'post').and.returnValue(createResponse(successToken));
    spyOn(localStorage, 'set');
    // Act
    let responseData;
    service.loginUser(credentials).subscribe((res) => {
      responseData = JSON.parse(res['body']);
    });
    // Assert
    expect(responseData).toEqual(successToken);
    expect(localStorage.set).toHaveBeenCalled();
  });

  it('should save user\'s information when fetching current user', () => {
    // Setup
    const successCurrentUser = { user: currentUser };
    const successToken = { token: 'test' };
    spyOn(http, 'get').and.returnValue(createResponse(successCurrentUser));
    spyOn(http, 'post').and.returnValue(createResponse(successToken));
    spyOn(store, 'set');
    // Act
    let responseData;
    service.loginUser(credentials).subscribe((res) => {
      responseData = JSON.parse(res['body']);
    });
    service.fetchCurrentUser();
    // Assert
    expect(store.set).toHaveBeenCalledWith('user', currentUser);
  });

});
