import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UIFromsModule } from '../core/ui/forms/ui-forms.module';
import { ReactiveFormsModule } from '@angular/forms';

// Components
import { UserComponent } from './components/user/user.component';

const ROUTES: Routes = [
  { path: '', component: UserComponent }
];

@NgModule({
  declarations: [
    UserComponent
  ],
  imports: [
    CommonModule,
    UIFromsModule,
    ReactiveFormsModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class UserModule { }
