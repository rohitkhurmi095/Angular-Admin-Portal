import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { Error404Component } from './shared/components/error404/error404.component';

const routes: Routes = [
  //Layout component
  {path:'',component:LayoutComponent,title:'Sahosoft Mall Admin Portal'},

  //Lazy loading for feature modules using dynamic imports
  {path:'auth',loadChildren:()=>import('./components/auth/auth.module').then(m=>m.AuthModule)},
  {path:'dashboard',loadChildren:()=>import('./components/dashboard/dashboard.module').then(m=>m.DashboardModule)},
  {path:'products',loadChildren:()=>import('./components/products/products.module').then(m=>m.ProductsModule)},
  {path:'sales',loadChildren:()=>import('./components/sales/sales.module').then(m=>m.SalesModule)},
  {path:'masters',loadChildren:()=>import('./components/masters/masters.module').then(m=>m.MastersModule)},
  {path:'users',loadChildren:()=>import('./components/users/users.module').then(m=>m.UsersModule)},
  {path:'settings',loadChildren:()=>import('./components/settings/settings.module').then(m=>m.SettingsModule)},
  {path:'invoices',loadChildren:()=>import('./components/invoices/invoices.module').then(m=>m.InvoicesModule)},
  {path:'reports',loadChildren:()=>import('./components/reports/reports.module').then(m=>m.ReportsModule)},

  //wildcard route
  {path:'**',component:Error404Component,title:'404 Not Found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
