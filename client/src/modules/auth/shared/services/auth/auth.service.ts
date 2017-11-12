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
  name: RoleType;
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
    data.user_id = parseInt(data.user_id);
    data.role_id = parseInt(data.role_id);
    return data;
  }

  /**
   * Returns the current Role object of the user
   * @returns {Role}
   */
  getRole(): Role {
    return {
      id: parseInt(this.payload.role_id),
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
      .do(this.setTokenFromResponse.bind(this))
      .catch((err) => Observable.throw(err));
  }

  /**
   * Retrieves current authenticated user
   * and registers it to the store.
   * @returns {void}
   */
  fetchCurrentUser(): void {
    if (this.token) {
      this.http.get(`${environment.host_server}/user/${this.payload.user_id}`)
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
    delete user.accepted_terms;
    return this.http.post(`${environment.host_server}/auth/register`, user)
      .catch((err) => Observable.throw(err));
  }

  /**
   * Registers role.
   * @param role
   * @param data
   * @returns {Observable<R|T>}
   */
  registerRole(role: RoleType, data: any): Observable<any> {
    return this.http.post(`${environment.host_server}/${role}`, data)
      .do(this.setTokenFromResponse.bind(this))
      .catch((err) => Observable.throw(err));
  }

  /**
   * Sets the token from response.
   * @param response
   */
  private setTokenFromResponse(response: any) {
    if (response.token) {
      const token = response.token;
      this.localStorage.set('token', token);
    }
  }

}
