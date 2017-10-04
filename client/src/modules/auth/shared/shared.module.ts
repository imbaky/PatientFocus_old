import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// services
import { AuthService } from './services/auth/auth.service';

// components
import { AuthPageComponent } from './components/auth-page/auth-page.component';

// interceptors
import { AuthInterceptor } from './interceptors/auth/auth.interceptor';

const ROUTES: Routes = [ ];

@NgModule({
  declarations: [
    AuthPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    HttpModule
  ],
  exports: [
    AuthPageComponent
  ]
})

export class SharedModule {
  static forRoot (): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        AuthService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        }
      ]
    };
  }
}
