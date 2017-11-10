import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// services
import { DocumentService } from './services/document/document.service';
import { SelectedDocumentService } from './services/selected-document/selected-document.service';
import { PatientService } from './services/patient/patient.service';
import { PatientResolver } from './resolvers/patient/patient.resolver';
import { LabelService } from './services/label/label.service';
import { SelectedPatientService } from './services/selected-patient/selected-patient.service';
import { ShareDocumentService } from './services/share-document/share-document.service';

// guards
import { PatientGuard } from './guards/patient/patient.guard';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule
  ]
})
export class SharedModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        LabelService,
        PatientGuard,
        PatientService,
        PatientResolver,
        DocumentService,
        SelectedDocumentService,
        SelectedPatientService,
        ShareDocumentService
      ]
    };
  }

}
