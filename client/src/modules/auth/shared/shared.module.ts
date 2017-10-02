import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';

// services
import { AuthService } from './services/auth/auth.service';

// components
import { AuthPageComponent } from './components/auth-page/auth-page.component';

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
  ],
  providers: [
    AuthService
  ]
})
export class SharedModule {
  static forRoot (): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        AuthService
      ]
    };
  }
}
