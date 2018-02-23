import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'
import { DataTablesModule } from 'angular-datatables';
import { AppRoutingModule } from './app-routing.module';
import { MapService } from './map.service';
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { AboutComponent } from './about/about.component';
import { AdminComponent } from './admin/admin.component';
import { MainComponent } from './main/main.component';
import { DirectoryComponent } from './directory/directory.component';



@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    AboutComponent,
    AdminComponent,
    MainComponent,
    DirectoryComponent
  ],
  imports: [
    FormsModule,
    HttpModule,
    BrowserModule,
    AppRoutingModule,
    DataTablesModule
  ],
  providers: [MapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
