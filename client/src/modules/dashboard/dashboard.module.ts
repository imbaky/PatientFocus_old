import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// modules
import { UIGeneric } from '../core/ui/generic/ui-generic.module';

// containers
import { UploadProgressComponent } from './containers/upload-progress/upload-progress.component';

// components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UploadItemComponent } from './components/upload-item/upload-item.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from '../auth/shared/guards/auth/auth.guard';
import { SharedModule } from '../patient/shared/shared.module';

const ROUTES: Routes = [
  { path: '', component: DashboardComponent, canActivate: [
    AuthGuard
  ], children: [
    { path: '', loadChildren: '../user/user.module#UserModule' },
    { path: 'document', loadChildren: '../patient/document/document.module#DocumentModule' },
  ] }
];

@NgModule({
  declarations: [
    DashboardComponent,
    UploadProgressComponent,
    UploadItemComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    UIGeneric,
    HttpClientModule,
    SharedModule.forRoot(),
    RouterModule.forChild(ROUTES)
  ]
})
export class DashboardModule { }
