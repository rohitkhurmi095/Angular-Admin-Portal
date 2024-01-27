import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { Error404Component } from './shared/components/error404/error404.component';
import { contentRoutes } from './shared/routes/content.routes';
import { authGuard } from './components/auth/auth.guard';

const routes: Routes = [

  //Login Page -> load 'auth' feature module
  {path:'auth',loadChildren:()=>import('./components/auth/auth.module').then(m=>m.AuthModule)},

  //Layout component with Lazy loading for feature modules (children) using dynamic imports
  //Note: contentRoutes - children of layout component (loads on the same screen)
  //Apply canActivateAuthGuard!
  {path:'',component:LayoutComponent,children:contentRoutes,canActivate:[authGuard]},

  //wildcard route
  {path:'**',component:Error404Component,title:'404 Not Found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
