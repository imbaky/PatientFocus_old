import { AuthService, RegistrationUser } from './auth.service';
import { TestBed } from '@angular/core/testing';
import { Http, ResponseOptions, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

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

const successMessage = { status: true };

describe('Auth Service', () => {
  let service: AuthService;
  let http: Http;

  beforeEach(() => {
    const bed = TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Http, useClass: MockHttp }
      ]
    });
    http = bed.get(Http);
    service = bed.get(AuthService);
  });

  it('should get a status of true when registering a user', () => {
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

});
