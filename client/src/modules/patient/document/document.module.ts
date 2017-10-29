import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// modules
import { SharedModule } from '../shared/shared.module';
import { UIGeneric } from '../../core/ui/generic/ui-generic.module'
import { PipeModule } from '../../core/pipe/pipe.module';

// components
import { DocumentItemComponent } from './components/document-item/document-item.component';

// container
import { DocumentComponent } from './containers/document/document.component';
import { DocumentListComponent } from './containers/document-list/document-list.component';
import { DocumentSidebarComponent } from './components/document-sidebar/document-sidebar.component';
import { DocumentLabelsComponent } from './containers/document-labels/document-labels.component';

// resolvers
import { PatientResolver } from '../shared/services/resolvers/patient.resolver';

const ROUTES: Routes = [
  { path: '', component: DocumentComponent, resolve: {
    patient: PatientResolver
  } }
];

@NgModule({
  declarations: [
    DocumentComponent,
    DocumentListComponent,
    DocumentItemComponent,
    DocumentSidebarComponent,
    DocumentLabelsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(ROUTES),
    UIGeneric,
    PipeModule,
    ReactiveFormsModule
  ]
})
export class DocumentModule { }
