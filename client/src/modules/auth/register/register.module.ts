import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// components
import { RegisterComponent } from './containers/register/register.component';

// modules
import { UIModule } from '../../core/ui/ui.module';

const ROUTES: Routes = [
  { path: '', component: RegisterComponent }
];

@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    UIModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class RegisterModule { }
