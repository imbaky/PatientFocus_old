import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// components
import { LoginComponent } from './containers/login/login.component';

// modules
import { UIModule } from '../../core/ui/ui.module';

const ROUTES: Routes = [
  { path: '', component: LoginComponent }
];

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    UIModule,
    RouterModule.forChild(ROUTES)
  ],
})
export class LoginModule { }
