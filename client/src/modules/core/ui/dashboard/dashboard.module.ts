import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// containers
import { UploadProgressComponent } from './containers/upload-progress/upload-progress.component';

// components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UploadItemComponent } from './components/upload-item/upload-item.component';

@NgModule({
  declarations: [
    DashboardComponent,
    UploadProgressComponent,
    UploadItemComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }
