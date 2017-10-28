import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// services
import { DocumentService } from './services/document/document.service';
import { SelectedDocumentService } from './services/selected-document/selected-document.service';
import { PatientService } from './services/patient/patient.service';

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
      providers: [
        PatientService,
        DocumentService,
        SelectedDocumentService,
      ]
    };
  }

}
