import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/pluck';
import 'rxjs/observable/throw';

import { LocalStorageService } from 'angular-2-local-storage';

import { Store } from '../../../../../app/store';
import { environment } from '../../../../../environments/environment';

export type RoleType = 'patient' | 'doctor';

export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  roles: Array<RoleType>;
}

export interface RegistrationUser {
  email: string;
  first_name: string;
  last_name: string;
  role: RoleType;
  password: string;
  accepted_terms: boolean;
}

export interface UserCredentials {
  email: string;
  password: string;
  remain_signed_in: boolean;
}

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient,
    private store: Store,
    private localStorage: LocalStorageService
  ) { }

  /**
   * Returns the JWT token
   * @returns {string}
   */
  get token(): string {
    return this.localStorage.get('token') as string;
  }

  /**
   * Returns the payload data in the JWT token
   * @returns {any}
   */
  get payload(): any {
    const token = this.token;
    const start = token.indexOf('.') + 1;

    const data = JSON.parse(atob(
      token.substr(start, token.lastIndexOf('.') - start)
    ));
    return data;
  }

  /**
   * Returns the current Role object of the user
   * @returns {Role}
   */
  getRole(): Role {
    return {
      id: this.payload.role_id,
      name: this.payload.role
    };
  }

  /**
   * Checks if the current user has the specified role
   * @param role
   * @returns {boolean}
   */
  hasRole(role: string): boolean {
    return this.getRole().name === role;
  }

  /**
   * Authenticates user with credentials
   * @param credentials {UserCredentials}
   * @returns {Observable<R|T>}
   */
  loginUser(credentials: UserCredentials): Observable<string> {
    return this.http.post(`${environment.host_server}/auth/login`, credentials)
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
      this.http.get(`${environment.host_server}/auth/user`)
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
    return this.http.post(`${environment.host_server}/auth/register`, user)
      .catch((err) => Observable.throw(err));
  }

}
