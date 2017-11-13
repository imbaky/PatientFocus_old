import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { AppComponent } from './containers/app/app.component';

// modules
import { AuthModule } from '../modules/auth/auth.module';

// services
import { Store } from './store';
import { DashboardModule } from '../modules/dashboard/dashboard.module';

// routes
const ROUTES: Routes = [ ];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AuthModule,
    DashboardModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [
    Store
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
