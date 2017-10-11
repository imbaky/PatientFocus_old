import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/pluck';
import 'rxjs/observable/throw';

import { LocalStorageService } from 'angular-2-local-storage';

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

export interface UserCredentials {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {

  user$: Observable<User>;

  constructor(
    private http: HttpClient,
    private store: Store,
    private localStorage: LocalStorageService
  ) { }

  get token() {
    return this.localStorage.get('token');
  }

  /**
   * Authenticates user with credentials
   * @param credentials {UserCredentials}
   * @returns {Observable<R|T>}
   */
  loginUser(credentials: UserCredentials): Observable<string> {
    return this.http.post('login', credentials)
      .do((res: any) => {
        if (res.token) {
          const token = res.token;
          this.localStorage.set('token', token);
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
    if (this.token) {
        this.http.get('fetchCurrentUser')
          .pluck('user')
          .subscribe((user: User) => {
            this.store.set('user', user);
          }, (err) => { });
    }
  }

  /**
   * Registers a user with registration information.
   * @param user {RegistrationUser}
   * @returns {Observable<R|T>}
   */
  registerUser(user: RegistrationUser): Observable<any> {
    return this.http.post('register', user)
      .catch((err) => Observable.throw(err));
  }

}
