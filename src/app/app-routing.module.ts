import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { Error404Component } from './shared/components/error404/error404.component';
import { contentRoutes } from './shared/routes/content.routes';

const routes: Routes = [
  //Layout component with Lazy loading for feature modules (children) using dynamic imports
  {path:'',component:LayoutComponent,children:contentRoutes},

  //wildcard route
  {path:'**',component:Error404Component,title:'404 Not Found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
