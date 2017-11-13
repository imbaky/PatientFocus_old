import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// components
import { AuthPageComponent } from './shared/components/auth-page/auth-page.component';
import { SharedModule } from './shared/shared.module';

const ROUTES: Routes = [
  { path: 'auth', component: AuthPageComponent, children: [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'register', loadChildren: './register/register.module#RegisterModule' },
    { path: 'login', loadChildren: './login/login.module#LoginModule'}
  ]}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    SharedModule.forRoot()
  ]
})
export class AuthModule {

}
