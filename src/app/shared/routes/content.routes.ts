import { Routes } from "@angular/router";

export const contentRoutes:Routes = [
 //Note: dashboard is feature module -> redirect '/' to '/dashboard'    
 { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
 
  //Lazy loading for feature modules using dynamic imports
  {path:'auth',loadChildren:()=>import('../../components/auth/auth.module').then(m=>m.AuthModule)},
  {path:'dashboard',loadChildren:()=>import('../../components/dashboard/dashboard.module').then(m=>m.DashboardModule)},
  {path:'products',loadChildren:()=>import('../../components/products/products.module').then(m=>m.ProductsModule)},
  {path:'sales',loadChildren:()=>import('../../components/sales/sales.module').then(m=>m.SalesModule)},
  {path:'masters',loadChildren:()=>import('../../components/masters/masters.module').then(m=>m.MastersModule)},
  {path:'users',loadChildren:()=>import('../../components/users/users.module').then(m=>m.UsersModule)},
  {path:'settings',loadChildren:()=>import('../../components/settings/settings.module').then(m=>m.SettingsModule)},
  {path:'invoices',loadChildren:()=>import('../../components/invoices/invoices.module').then(m=>m.InvoicesModule)},
  {path:'reports',loadChildren:()=>import('../../components/reports/reports.module').then(m=>m.ReportsModule)},
];