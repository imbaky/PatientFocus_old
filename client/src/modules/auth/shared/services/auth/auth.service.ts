import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/observable/throw';

export type Role = 'patient' | 'doctor';

export interface User {
  first_name: string;
  last_name: string;
  email: string;
  roles: Array<Role>;
}

export interface RegistrationUser {
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
  password: string;
  accepted_terms: boolean;
}

@Injectable()
export class AuthService {

  user$: User;

  constructor(
    private http: Http
  ) { }

  /**
   * Registers a user with registration information.
   * @param user {RegistrationUser}
   * @returns {Observable<R|T>}
   */
  registerUser(user: RegistrationUser): Observable<User> {
    return this.http.post('somewhere', user)
      .map((res) => res.json())
      .catch((err) => Observable.throw(err));
  }

}
