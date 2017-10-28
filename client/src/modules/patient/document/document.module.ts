import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { SharedModule } from '../shared/shared.module';

// components
import { RouterModule, Routes } from '@angular/router';
import { DocumentItemComponent } from './components/document-item/document-item.component';

// container
import { DocumentComponent } from './containers/document/document.component';
import { DocumentListComponent } from './containers/document-list/document-list.component';

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
    DocumentItemComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class DocumentModule { }
