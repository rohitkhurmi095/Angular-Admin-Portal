import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { Global } from 'src/app/shared/utility/global';

//Charts
import {GoogleChartType} from 'ng2-google-charts';
import { ChartDataset,ChartOptions, ChartTypeRegistry,Chart, ChartConfiguration } from 'chart.js';
import { OrderStatusChartService } from 'src/app/shared/services/charts/order-status-chart.service';
import { SalesDataChartService } from 'src/app/shared/services/charts/sales-data-chart.service';
import { UserGrowthChartService } from 'src/app/shared/services/charts/user-growth-chart.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit{

  constructor(private _httpService:HttpService, private _toastr:ToastrService, private _orderStatusChartService: OrderStatusChartService, private _salesDataChartService:SalesDataChartService, private _userGrowthChartService:UserGrowthChartService){}

  componentName:string = "Reports";

  ngOnInit(){
    this.getChartUserGrowth();
    this.getChartOrderStatus();
    this.getChartSalesDataPaymentTypeWise();
  }


  //============================
  //SalesDataPaymentTypeWiseApi
  //============================
  salesData:any[];

  salesDataChart:ChartDataset[];  
  salesDataChartLabel: any[] = [];
  salesDataChartOptions = {
    responsive: true,
    scaleShowGridLines: true,
    scaleGridLineWidth: 1,
    scaleShowHorizontalLines: true,
    scaleShowVerticalLines: true,
    bezierCurve: true,
    bezierCurveTension: 0.4,
    pointDot: true,
    pointDotRadius: 4,
    pointDotStrokeWidth: 1,
    pointHitDetectionRadius: 20,
    datasetStroke: true,
    datasetStrokeWidth: 2,
    datasetFill: true,
    maintainAspectRatio: false,
   };
   salesDataChartLegend = true;
   salesDataChartType: keyof ChartTypeRegistry = 'bar';


  getChartSalesDataPaymentTypeWise(){
    this._httpService.get(Global.BASE_API_URL+'PaymentMaster/GetChartSalesDataPaymentTypeWise').subscribe(res=>{
      console.log('Reports -> ChartApi_SalesDataPaymentTypeWise: ',res);
      if(res.isSuccess){
        this.salesData = this._salesDataChartService.getChartSalesData(res.data);

        //chartData
        this.salesDataChart = this.salesData[0].body;
        this.salesDataChartLabel = this.salesData[0].header;
      }
      else{
        this._toastr.error(res.errors[0],this.componentName);
      }
    })
  }



  //====================
  //OrderStatusChartApi
  //====================
  orderStatusData:any[]; 
  orderStatusChart:any;
  
  getChartOrderStatus(){
    this._httpService.get(Global.BASE_API_URL+'PaymentMaster/GetChartOrderStatus').subscribe(res=>{
      console.log('Reports -> ChartApi_OrderStatus: ',res);
      if(res.isSuccess){
        this.orderStatusData = this._orderStatusChartService.getChartOrderStatus(res.data);

        //chartData
        this.orderStatusChart = { 
          chartType: GoogleChartType.LineChart, 
          dataTable: this.orderStatusData,  
          options: { 
            //title: 'Order Status',
            bars: "horizontal", 
            vAxis: { format: "decimal" }, 
            //legend: { position: 'none' }, 
            height: 340,
            width: '100%', 
            colors: ["#a5a5a5","#81ba00","#ffbc58","#ff8084"], 
            backgroundColor: 'transparent' 
          }, 
        };  
      }
      else{
        this._toastr.error(res.errors[0],this.componentName);
      }
    });
  }




  //===================
  //customerGrowthChartApi
  //===================
  //customerGrowth
  usersGrowthData:any[];
  usersGrowthChart: any;

  getChartUserGrowth(){
    this._httpService.get(Global.BASE_API_URL+'PaymentMaster/GetChartUserGrowth').subscribe(res=>{
      console.log('Reports -> ChartApi_UserGrowth: ',res);
      if(res.isSuccess){
        this.usersGrowthData = this._userGrowthChartService.getChartUserGrowth(res.data);

        //chartData
        this.usersGrowthChart = { 
          chartType: GoogleChartType.AreaChart, 
          dataTable: this.usersGrowthData,
          options: { 
            //title: 'Users Growth',
            bars: "horizontal", 
            hAxis: { textPosition: 'none'},
            vAxis: { format: "decimal" }, 
            //legend: { position: 'none' }, 
            height: 370,
            width: '100%', 
            backgroundColor: 'transparent'
          }, 
        };  
      }
      else{
        this._toastr.error(res.errors[0],this.componentName);
      }
    });
  }  

}
