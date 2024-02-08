import { Component,OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { Global } from 'src/app/shared/utility/global';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit{

  constructor(private _httpService:HttpService,private _toastr:ToastrService){}

  ngOnInit(){
    this.getInvoicesList();
  }

  
  //==============
  //Invoices List
  //==============
  invoices:any[];
  getInvoicesList(){
    this._httpService.get(Global.BASE_API_URL+'PaymentMaster/GetReportInvoiceList').subscribe(res=>{
      console.log("Invoice: ",res);
      if(res.isSuccess){
        this.invoices = res.data.map(x=>{
          x.paymentDate = this.convertDate(x.paymentDate);
          return x;
        })
        console.log('Invoices: ',this.invoices);
      }
      else{
        this._toastr.error(res.errors[0],"Invoices List");
      }
    });
  }


  //convert 2019.12.26 -> 26/12/2019
  convertDate(date:string){
    let [year,month,day] = date.split('.');
    return `${day}/${month}/${year}`;
  }
}
