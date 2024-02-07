import { Component, ViewChild } from '@angular/core';
import { CountUpDirective } from 'ngx-countup';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { Global } from 'src/app/shared/utility/global';
import { DashboardCounter } from './dashboard-counter';

//Excel Export
import * as XLSX from 'xlsx'; 
import { Table } from 'primeng/table';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  componentName:string = "Dashboard";
  orders:any[];
  
  constructor(private _httpService:HttpService,private _toastr:ToastrService){}

  ngOnInit(){
    this.getNetFigureForDashboard();
    this.getOrderStatus();
  }

  //===================
  //Dashboard Counters
  //===================
  dashboardCounter:DashboardCounter[] = [
    {name:'Orders',count:0,bgClass:'bg-warning',fontClass:'font-warning',icon:'navigation'},
    {name:'Shipping Amount',count:0,bgClass:'bg-secondary',fontClass:'font-secondary',icon:'box'},
    {name:'Cash On Delivery',count:0,bgClass:'bg-primary',fontClass:'font-primary',icon:'message-square'},
    {name:'Cancelled',count:0,bgClass:'bg-danger',fontClass:'font-danger',icon:'users'}
  ]

  getNetFigureForDashboard(){
    this._httpService.get(Global.BASE_API_URL+'PaymentMaster/GetReportNetFigure').subscribe(res=>{
      console.log('PaymentMaster -> GetNetFigure: ',res);
      if(res.isSuccess){
        this.dashboardCounter[0].count = res.data[0].orders;
        this.dashboardCounter[1].count = res.data[0].shippingAmount;
        this.dashboardCounter[2].count = res.data[0].cashOnDelivery;
        this.dashboardCounter[3].count = res.data[0].cancelled; 
      }else{
        this._toastr.error(res.errors[0],this.componentName);
      }
    })
  }


  //=======
  //Orders
  //=======
  getOrderStatus(){
    this._httpService.get(Global.BASE_API_URL+'PaymentMaster/GetReportManageOrder').subscribe(res=>{
      console.log('Dashboard -> GetOrders: ',res);
      if(res.isSuccess){
          this.orders = res.data.map(x=>{
            x.paymentDate = this.formatDate(x.paymentDate);
            return x;
          })
        console.log('Orders: ',this.orders);
      }else{
        this._toastr.error(res.errors[0],this.componentName);
      }
    })
  }

  //converting date(2019.12.26 -> 26/12/2019)
  formatDate(date:string){
    let [year,month,day] = date.split('.');
    return `${day}/${month}/${year}`; 
  }

  //=============================
  //Export to Excel using 'xlsx'
  //=============================
  @ViewChild('orderTable') orderTable: Table;

  exportData(){
    //1.To directly convert json -> excel (WITHOUT MODIFYING)
    //const workSheet = XLSX.utils.json_to_sheet(this.orders);

    //2.To convert 'table' element inside ngPrime table -> excel (CURRENT PAGE DATA)
    //const workSheet = XLSX.utils.table_to_sheet(this.orderTable.el.nativeElement.querySelector('table'));

    //3.Convert json -> excel (with modifications)
    const excelData = this.orders.map(x=>{
      return {
        'Order Id': x.orderId,
        'Order Status': this.stripHtml(x.orderStatus),
        'Payment Date': x.paymentDate,
        'Payment Method': x.paymentMethod,
        'Payment Status': this.stripHtml(x.paymentStatus),
        'SubTotal Amount': x.subTotalAmount,
        'Shipping Amount': x.shippingAmount,
        'Total Amount': x.totalAmount
      }
    });
    const workSheet = XLSX.utils.json_to_sheet(excelData);


    //create workBook
    const workBook = XLSX.utils.book_new();
    //append workSheet to workBook
    XLSX.utils.book_append_sheet(workBook,workSheet,'Sheet1');
    //write to excel
    XLSX.writeFile(workBook,'Orders.xlsx');
  }

  //convert html -> text
  stripHtml(html:string):string{
    const doc = new DOMParser().parseFromString(html,'text/html');
    return doc.body.textContent;
  }

}
