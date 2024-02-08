import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { OrdersComponent } from './orders/orders.component';
import { TransactionsComponent } from './transactions/transactions.component';

//PrimeNg
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [
    OrdersComponent,
    TransactionsComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    TableModule,   //primeNg Table   
    ButtonModule,  //primeNg buttons
    InputTextModule //primeNg searchIcon
  ]
})
export class SalesModule { }
