import { AuthService, RegistrationUser, Credentials } from './auth.service';
import { TestBed } from '@angular/core/testing';
import { Http, ResponseOptions, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

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
}

describe('Auth Service', () => {
  let service: AuthService;
  let http: Http;

  beforeEach(() => {
    const bed = TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Http, useClass: MockHttp },
        Store
      ]
    });
    http = bed.get(Http);
    service = bed.get(AuthService);
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

  it('should get a status of true when signing in a user', () => {
    const successToken = 'p4ti3nt';

    spyOn(http, 'post').and.returnValue(createResponse(successToken));

    const credentials: Credentials = {
      email: 'ericsnowden@nsa.com',
      password: 'allyourbasearebelongtous'
    };

    service.loginUser(credentials)
      .subscribe((result: any) => {
        expect(result).toBe('p4ti3nt');
      });
  })

});
