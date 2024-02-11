import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CountUpModule } from 'ngx-countup';

//PrimeNg
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

//Chart
import { Ng2GoogleChartsModule } from 'ng2-google-charts';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,   //for feather-icon
    CountUpModule, //for ngx-countup
    TableModule,   //primeNg Table   
    ButtonModule,  //primeNg buttons
    InputTextModule, //primeNg searchIcon
    Ng2GoogleChartsModule
  ]
})
export class DashboardModule { }
