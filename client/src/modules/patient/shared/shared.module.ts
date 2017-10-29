import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// services
import { DocumentService } from './services/document/document.service';
import { SelectedDocumentService } from './services/selected-document/selected-document.service';
import { PatientService } from './services/patient/patient.service';
import { PatientResolver } from './services/resolvers/patient.resolver';
import { LabelService } from './services/label/label.service';
import { SelectedPatientService } from './services/selected-patient/selected-patient.service';

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
        LabelService,
        PatientService,
        PatientResolver,
        DocumentService,
        SelectedDocumentService,
        SelectedPatientService
      ]
    };
  }

}
