import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { SharedModule } from './shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule.forRoot()
  ]
})
export class PatientModule { }
