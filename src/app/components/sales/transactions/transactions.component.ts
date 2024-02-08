import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { Global } from 'src/app/shared/utility/global';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  
  constructor(private _httpService:HttpService,private _toastr:ToastrService){}

  ngOnInit(){
    this.getTransactionsList();
  }

  //==================
  //Transactions List
  //==================
  transactions:any[];
  getTransactionsList(){
    this._httpService.get(Global.BASE_API_URL+'PaymentMaster/GetReportTransactionDetails').subscribe(res=>{
      console.log("Sales ->Transactions: ",res);
      if(res.isSuccess){
        this.transactions = res.data.map(x=>{
          x.paymentDate = this.convertDate(x.paymentDate);
          return x;
        });
        console.log('Transactions: ',this.transactions); 
      }
      else{
        this._toastr.error(res.errors[0],"Transactions List");
      }
    });
  }


  //convert 2019.12.26 -> 26/12/2019
  convertDate(date:string){
    let [year,month,day] = date.split('.');
    return `${day}/${month}/${year}`;
  }
}
