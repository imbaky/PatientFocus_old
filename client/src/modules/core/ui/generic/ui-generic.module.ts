import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// directives
import { PopperComponent, PopperDirective } from './directive/popper/popper.directive';

@NgModule({
  declarations: [
    PopperDirective,
    PopperComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PopperDirective,
    PopperComponent
  ],
  entryComponents: [
    PopperComponent
  ]
})
export class UIGeneric { }
