import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// modules
import { SharedModule } from '../shared/shared.module';
import { UIGeneric } from '../../core/ui/generic/ui-generic.module';
import { PipeModule } from '../../core/pipe/pipe.module';

// components
import { DocumentItemComponent } from './components/document-item/document-item.component';
import { DocumentLabelComponent } from './components/document-label/document-label.component';

// container
import { DocumentComponent } from './containers/document/document.component';
import { DocumentListComponent } from './containers/document-list/document-list.component';
import { DocumentSidebarComponent } from './containers/document-sidebar/document-sidebar.component';
import { LabelsComponent } from './containers/labels/labels.component';

// resolvers
import { PatientResolver } from '../shared/resolvers/patient/patient.resolver';

// guard
import { PatientGuard } from '../shared/guards/patient/patient.guard';
import { UIFromsModule } from '../../core/ui/forms/ui-forms.module';
import { DocumentSendFormComponent } from './containers/document-sendform/document-send-form.component';

const ROUTES: Routes = [
  { path: '', component: DocumentComponent, resolve: {
    patient: PatientResolver,
  }, canActivate: [
      PatientGuard
  ] }
];

@NgModule({
  declarations: [
    DocumentComponent,
    DocumentListComponent,
    DocumentItemComponent,
    DocumentSidebarComponent,
    DocumentLabelComponent,
    DocumentSendFormComponent,
    LabelsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(ROUTES),
    UIGeneric,
    PipeModule,
    ReactiveFormsModule,
    UIFromsModule,
    ReactiveFormsModule
  ]
})
export class DocumentModule { }
