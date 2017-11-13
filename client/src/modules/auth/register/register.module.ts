import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// components
import { RegisterComponent } from './containers/register/register.component';

// modules
import { UIFromsModule } from '../../core/ui/forms/ui-forms.module';

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
    UIFromsModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class RegisterModule { }
