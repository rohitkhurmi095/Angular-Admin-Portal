import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { AddProductComponent } from './manage/add-product/add-product.component';
import { ProductsListComponent } from './manage/products-list/products-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from 'src/app/shared/shared.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


@NgModule({
  declarations: [
    AddProductComponent,
    ProductsListComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    ReactiveFormsModule, //for forms
    NgxDatatableModule, //for Ngx DataTable
    SharedModule,       //for featherIcon
    CKEditorModule     //for CKEditor5
  ]
})
export class ProductsModule { }
