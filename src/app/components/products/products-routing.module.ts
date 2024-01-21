import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './manage/add-product/add-product.component';
import { ProductsListComponent } from './manage/products-list/products-list.component';

const routes: Routes = [
  {path:'manage/add-product',component:AddProductComponent,title:'Add Product'},
  {path:'manage/products-list',component:ProductsListComponent,title:'Products List'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
