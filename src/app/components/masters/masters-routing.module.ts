import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TagComponent } from './tag/tag.component';
import { SizeComponent } from './size/size.component';
import { ColorComponent } from './color/color.component';
import { CategoryComponent } from './category/category.component';
import { BrandLogoComponent } from './brand-logo/brand-logo.component';
import { UserTypeComponent } from './user-type/user-type.component';

const routes: Routes = [
  {path:'tag',component:TagComponent,title:'Tag Master'},
  {path:'size',component:SizeComponent,title:'Size Master'},
  {path:'color',component:ColorComponent,title:'Color Master'},
  {path:'category',component:CategoryComponent,title:'Category Master'},
  {path:'brand-logo',component:BrandLogoComponent,title:'Brand Logo Master'},
  {path:'user-type',component:UserTypeComponent,title:'User Type Master'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }
