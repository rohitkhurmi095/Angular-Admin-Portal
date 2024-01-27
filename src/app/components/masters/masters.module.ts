import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MastersRoutingModule } from './masters-routing.module';
import { TagComponent } from './tag/tag.component';
import { SizeComponent } from './size/size.component';
import { ColorComponent } from './color/color.component';
import { CategoryComponent } from './category/category.component';
import { BrandLogoComponent } from './brand-logo/brand-logo.component';
import { UserTypeComponent } from './user-type/user-type.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
    TagComponent,
    SizeComponent,
    ColorComponent,
    CategoryComponent,
    BrandLogoComponent,
    UserTypeComponent
  ],
  imports: [
    CommonModule,
    MastersRoutingModule,
    NgbModule, //for tabset
    ReactiveFormsModule, //for forms
    NgxDatatableModule
  ]
})
export class MastersModule { }
