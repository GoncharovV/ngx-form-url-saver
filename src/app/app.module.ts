import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './components/app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormUrlSaverLibModule } from 'projects/form-url-saver-lib/src/public-api';
import { AppRoutingModule } from './app-routing.module';
import { MaterialProxyModule } from './shared/material-proxy/material-proxy.module';
import { DisplayNavigationComponent } from './components/display-navigation/display-navigation.component';

@NgModule({
  declarations: [
    AppComponent,
    DisplayNavigationComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    FormUrlSaverLibModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialProxyModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
