import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { Global } from 'src/app/shared/utility/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit,OnDestroy{

  constructor(private _httpService:HttpService,private _toastr:ToastrService,private _router:Router){}

  componentName:string = "Users List";
  objRows:any[];

  ngOnInit(){
      this.getAllRecords();
  }


  //========
  //Get All
  //========
  getAllRecords(){
    this._httpService.get(Global.BASE_API_URL+'UserMaster/GetAll').subscribe(res=>{
      console.log('Users -> GetAll: ',res);
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
  edit(id:number){
    //navigate to edit page
   
    //1. pass edit -> 'id' via state as navigationExtras (dynamic + hidden in url)
    //'/users/add-user'
    let navigationExtrasState:NavigationExtras = {
      state:{ 
        id:id 
      }
    }
    this._router.navigate(['users/add-user'],navigationExtrasState);

    //2. pass edit -> 'id' as queryParam (optional parameters - shows in url)
    //'users/add-user?id=2504'
    // let navigationExtrasQueryParam: NavigationExtras = {
    //   queryParams:{
    //     id:id
    //   }
    // }
    // this._router.navigate(['users/add-user'],navigationExtrasQueryParam);
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
        this._httpService.post(Global.BASE_API_URL+'UserMaster/Delete/',{"id":id}).subscribe(res=>{
          console.log('Users -> Delete: ',res);
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
