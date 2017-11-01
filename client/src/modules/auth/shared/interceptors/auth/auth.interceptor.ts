import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../../shared/services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private injector: Injector,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Use special injector to avoid cyclic dependency issue with HttpInterceptor
    const token = this.injector.get(AuthService).token;

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req).do((event) => { }, (err) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        this.router.navigate(['/auth/login']);
      }
    });

  }
}
