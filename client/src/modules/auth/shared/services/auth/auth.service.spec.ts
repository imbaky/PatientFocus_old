import { AuthService, RegistrationUser, Credentials, User, Role } from './auth.service';
import { TestBed } from '@angular/core/testing';
import { Http, ResponseOptions, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';

import { Store } from '../../../../../app/store';

export function createResponse(body) {
  return Observable.of(
    new Response(new ResponseOptions({ body: JSON.stringify(body) }))
  );
}

export class MockHttp {
  post() {
    return createResponse({});
  }

  get(){
    return createResponse({});
  }
}

describe('Auth Service', () => {
  let service: AuthService;
  let http: Http;
  let store: Store;
  let localStorage: LocalStorageService;

  beforeEach(() => {
    const bed = TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Http, useClass: MockHttp },
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
    http = bed.get(Http);
    service = bed.get(AuthService);
    store = bed.get(Store);
    localStorage = bed.get(LocalStorageService);
  });

  it('should get a status of true when registering a user', () => {
    const successMessage = { status: true };
    spyOn(http, 'post').and.returnValue(createResponse({ ...successMessage }));
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
  });

  it('should get a token when signing in a user', () => {
    const successToken = { token: 'p4ti3nt' };

    spyOn(http, 'post').and.returnValue(createResponse(successToken));
    spyOn(localStorage, 'set');

    const credentials: Credentials = {
      email: 'ericsnowden@nsa.com',
      password: 'allyourbasearebelongtous'
    };

    service.loginUser(credentials)
      .subscribe((result: any) => {
        expect(result).toEqual(successToken);
        expect(localStorage.set).toHaveBeenCalled();
      });
  });

  it('should save user\'s information when fetching current user', () => {
    const currentUser: User = {
      first_name: 'Bob',
      last_name: 'Marley',
      email: '',
      roles: ['patient']
    };
    const success = { user: currentUser };

    spyOn(http, 'get').and.returnValue(createResponse(success));
    spyOn(store, 'set');

    service.fetchCurrentUser()
      .subscribe((result: any) => {
        expect(result).toEqual(success);
        expect(store.set).toHaveBeenCalled();
      });
  });

});
