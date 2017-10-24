import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// modules
import { SharedModule } from './shared/shared.module';

// components
import { DashboardComponent } from '../core/ui/dashboard/components/dashboard/dashboard.component';
import { DashboardModule } from '../core/ui/dashboard/dashboard.module';

const ROUTES: Routes = [
  { path: 'patient', component: DashboardComponent, children: [
    { path: '', pathMatch: 'full', redirectTo: 'document' },
    { path: 'document', loadChildren: './document/document.module#DocumentModule' }
  ] }
];

@NgModule({
  imports: [
    CommonModule,
    DashboardModule,
    SharedModule.forRoot(),
    RouterModule.forChild(ROUTES)
  ]
})
export class PatientModule { }
