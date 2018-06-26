import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { MapService } from './map.service';
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { AboutComponent } from './about/about.component';
import { MainComponent } from './main/main.component';
import { DirectoryComponent } from './directory/directory.component';

import { MaterialModule } from './material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { DialogboxComponent } from './dialogbox/dialogbox.component';


@NgModule({
  declarations: [
    DialogboxComponent,
    AppComponent,
    NavigationComponent,
    AboutComponent,
    MainComponent,
    DirectoryComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    AppRoutingModule,
  ],
  entryComponents: [
    DialogboxComponent
  ],
  providers: [MapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
