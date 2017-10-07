import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { AppComponent } from './containers/app/app.component';

// modules
import { AuthModule } from '../modules/auth/auth.module';
import { PatientModule } from '../modules/patient/patient.module';

// services
import { Store } from './store';

// routes
const ROUTES: Routes = [ ];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AuthModule,
    PatientModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [
    Store
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
