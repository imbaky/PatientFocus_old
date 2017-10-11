import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// services
import { DocumentService } from './services/document/document.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ]
})
export class SharedModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [ DocumentService ]
    };
  }

}
