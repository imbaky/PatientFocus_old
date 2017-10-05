import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/observable/throw';

import { LocalStorageService, ILocalStorageServiceConfig } from 'angular-2-local-storage';

import { Store } from '../../../../../app/store';

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

export interface Credentials {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {

  user$: Observable<User>;

  constructor(
    private http: Http,
    private store: Store,
    private localStorage: LocalStorageService
  ) { }

  /**
   * Authenticates user credentials with JWT 
   * @param credentials {Credentials}
   * @returns {Observable<R|T>}
   */
  loginUser(credentials: Credentials): Observable<string> {
    return this.http.post('somehow', credentials)
      .map((res) => res.json())
      .do((res) => {
        if (res.token) {
          this.localStorage.set("jwt", res.token);
        }
      })
      .catch((err) => Observable.throw(err));
  }

  /**
   * Retrieves current authenticated user
   * and registers it to the store.
   * @returns {void}
   */
  fetchCurrentUser(): void {
    this.user$ = this.http.get('something')
      .map((res) => res.json())
      .do((res) => {
        if(res.user){
          this.store.set('user', res.user);
        }
      })
      .catch((err) => Observable.throw(err));
  }

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
