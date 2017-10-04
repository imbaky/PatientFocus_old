import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/observable/throw';

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
    private store: Store
  ) { }

  /**
   * Authenticates user with their credentials.
   * @param credentials {Credentials}
   * @returns {Observable}
   */
  loginUser(credentials: Credentials): Observable<string> {
    return this.http.post('x', credentials)
      .map((res) => res.json())
      .pluck("token")
      .do((token) => {
        if(token){
          // Store the token somewhere (e.g. cookie)
          // Create Cookie Service?
        }
      })
      .catch((err) => Observable.throw(err));
  }

  /**
   * 
   */
  getCurrentUser(): Observable<User>{
    this.user$ = this.http.get('y')
      .map((res) => res.json())
      .pluck("user")
      .do((user: User) => {
        this.store.set('user', user);
      })
      .catch((err) => Observable.throw(err));
    
      return this.user$;
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
