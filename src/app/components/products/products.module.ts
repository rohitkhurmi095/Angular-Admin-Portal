import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { AddProductComponent } from './manage/add-product/add-product.component';
import { ProductsListComponent } from './manage/products-list/products-list.component';


@NgModule({
  declarations: [
    AddProductComponent,
    ProductsListComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule { }
