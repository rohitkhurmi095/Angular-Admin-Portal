import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { Global } from 'src/app/shared/utility/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit,OnDestroy {

  constructor(private _httpService:HttpService,private _toastr:ToastrService, private _router:Router){}

  componentName:string = "Products List";
  objRows:any[];

  ngOnInit(){
      this.getAllRecords();
  }
  
  //========
  //Get All
  //========
  getAllRecords(){
    this._httpService.get(Global.BASE_API_URL+'ProductMaster/GetAll').subscribe(res=>{
      console.log('Products -> GetAll: ',res);
      if(res.isSuccess){
        this.objRows = res.data;
      }else{
        this._toastr.error(res.errors[0],this.componentName);
      }
    })
  }


  //=====
  //Edit
  //=====
  //Pass id -> add-product page (dynamic + don't show in url)
  //'/products/manage/add-product'
  edit(id:number){
    let navigationExtrasState:NavigationExtras = {
      state: {
        id: id
      }
    }
    this._router.navigate(['/products/manage/add-product'],navigationExtrasState);

    //2. using queryParams (show in url)
    //'/products/manage/add-product?id=101'
    // let navigationExtrasQueryParam:NavigationExtras = {
    //   queryParams: {
    //     id: id
    //   }
    // }
    // this._router.navigate(['/products/manage/add-product'],navigationExtrasQueryParam);
  }


  //=======
  //Delete
  //=======
  delete(id:number){
    //sweetAlert2 - confirmation Modal
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger mx-2"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        //call Delete API!
        this._httpService.post(Global.BASE_API_URL+'ProductMaster/Delete/',{"id":id}).subscribe(res=>{
          console.log('Products -> Delete: ',res);
          if(res.isSuccess){
            swalWithBootstrapButtons.fire({
              title: "Deleted!",
              text: "Your record has been deleted.",
              icon: "success"
            });

            //Refresh Grid
            this.getAllRecords();
          }else{
            this._toastr.error(res.errors[0],this.componentName);
          }
        })
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your record is safe :)",
          icon: "error"
        });
      }
    });
  }


  ngOnDestroy(){
      this.objRows = null;
  }
}
