import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AdminComponent } from './admin/admin.component';


const routes: Routes = [
  { path: 'about', pathMatch: "full", component: AboutComponent, children: []},
  { path: 'admin', pathMatch: "full", component: AdminComponent, children: []}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
