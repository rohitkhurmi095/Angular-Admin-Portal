import { Component,OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { Global } from 'src/app/shared/utility/global';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  constructor(private _httpService:HttpService,private _toastr:ToastrService){}

  ngOnInit(){
    this.getOrdersList();
  }

  //=============
  // Orders List
  //=============
  orders:any[];
  getOrdersList(){
    this._httpService.get(Global.BASE_API_URL+'PaymentMaster/GetReportManageOrder').subscribe(res=>{
      console.log("Sales ->Orders: ",res);
      if(res.isSuccess){
        this.orders = res.data.map(x=>{
          x.paymentDate = this.convertDate(x.paymentDate);
          return x;
        })
        console.log('Orders: ',this.orders);
      }
      else{
        this._toastr.error(res.errors[0],"Orders List");
      }
    });
  }


  //convert 2019.12.26 -> 26/12/2019
  convertDate(date:string){
    let [year,month,day] = date.split('.');
    return `${day}/${month}/${year}`;
  }
}
