import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// containers
import { PillSelectorComponent } from './containers/forms/pill-selector/pill-selector.component';
import { ShortStringComponent } from './containers/forms/short-string/short-string.component';
import { CheckboxComponent } from './containers/forms/checkbox/checkbox.component';

// components
import { FormGroupComponent } from './components/form-group/form-group.component';

@NgModule({
  declarations: [
    ShortStringComponent,
    PillSelectorComponent,
    CheckboxComponent,
    FormGroupComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    ShortStringComponent,
    PillSelectorComponent,
    CheckboxComponent,
    FormGroupComponent
  ]
})
export class UIModule { }
