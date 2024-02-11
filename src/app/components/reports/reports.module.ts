import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';

//for charts
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    Ng2GoogleChartsModule,
    NgChartsModule
  ]
})
export class ReportsModule { }
