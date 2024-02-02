import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { AddUserComponent } from './add-user/add-user.component';
import { UsersListComponent } from './users-list/users-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


@NgModule({
  declarations: [
    AddUserComponent,
    UsersListComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    ReactiveFormsModule, //for forms
    NgxDatatableModule, //for ngx-datatable
  ]
})
export class UsersModule { }
