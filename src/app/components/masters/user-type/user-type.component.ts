import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { DbOperations } from 'src/app/shared/utility/db-operations';
import { Global } from 'src/app/shared/utility/global';
import { CharFieldValidator, NoWhiteSpaceFieldValidator } from 'src/app/shared/validations/validation.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-type',
  templateUrl: './user-type.component.html',
  styleUrls: ['./user-type.component.scss']
})
export class UserTypeComponent {

  constructor(private _fb:FormBuilder,private _httpService:HttpService, private _toastr:ToastrService){}

  @ViewChild('nav') elNav:any;     //nav templateRef variable
  componentName = 'User Type Master';
  buttonText = "";                //buttonText
  dbOperations:DbOperations;     //dbOperation
  fData:FormGroup;              //FormGroup Instance
  objRows:any[];               //for allData
  objRow:any;                 //for singleData

  ngOnInit(){
    this.setFormData();
    this.getAllRecords();
  }

  setFormData(){
    //default formState
    this.buttonText = "Add";
    this.dbOperations = DbOperations.create;

    this.fData = this._fb.group({
      id:[0],
      name:['',Validators.compose([Validators.required,Validators.minLength(4),Validators.maxLength(12),CharFieldValidator.ValidCharField,NoWhiteSpaceFieldValidator.ValidNoWhiteSpaceField])]
    })
  }

  get formControls(){
    return this.fData.controls;
  }

  resetFormData(){
    this.fData.reset({
      id:0,
      name:''
    })
  }

  //========
  //Get All
  //========
  getAllRecords(){
    //call GetAll API!
    this._httpService.get(Global.BASE_API_URL+'UserType/GetAll').subscribe(res=>{
      console.log('UserType Master -> GetAll: ',res);
      if(res.isSuccess){
        this.objRows = res.data;
      }else{
        this._toastr.error(res.errors[0],this.componentName);
      }
    })
  }


  //=============
  //Add | Update
  //=============
  submit(){
    if(!this.fData.valid){
      return;
    }
     
    switch(this.dbOperations){
      case DbOperations.create:
        //call Save API!
        this._httpService.post(Global.BASE_API_URL+'UserType/Save/',this.fData.value).subscribe(res=>{
          console.log('UserType Master -> Save: ',res);
          if(res.isSuccess){
            this._toastr.success("Record Saved Succssfully!",this.componentName);
            
            //reset formState
            this.resetFormData();
            this.buttonText = "Add";
            this.dbOperations = DbOperations.create;

            //Refresh Grid and navigate to viewTab
            this.getAllRecords();
            this.elNav.select('viewTab');
          }else{
            this._toastr.error(res.errors[0],this.componentName);
          }
        })
      break;

      case DbOperations.update:
        //call Update API!
        this._httpService.post(Global.BASE_API_URL+'UserType/Update/',this.fData.value).subscribe(res=>{
          console.log('UserType Master -> Update: ',res);
          if(res.isSuccess){
            this._toastr.success("Record Updated Succssfully!",this.componentName);

             //reset formState
             this.resetFormData();
             this.buttonText = "Add";
             this.dbOperations = DbOperations.create; 

            //Refresh Grid and navigate to viewTab
            this.getAllRecords();
            this.elNav.select('viewTab');
          }else{
            this._toastr.error(res.errors[0],this.componentName);
          }
        })
      break;
    }
  }


  cancel(){
    //reset formState and navigate to viewTab
    this.resetFormData();
    this.buttonText = "Add";
    this.dbOperations = DbOperations.create;

    this.elNav.select('viewTab');
  }


  //=====
  //Edit
  //=====
  edit(id:number){
    this.buttonText = "Update";
    this.dbOperations = DbOperations.update;

    //Get single record from all records
    this.objRow = this.objRows.find(x=> x.id === id);
    //fill single record in form
    this.fData.setValue({
      id: this.objRow.id,
      name:this.objRow.name
    });

    //open edit form
    this.elNav.select('addTab');
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
        this._httpService.post(Global.BASE_API_URL+'UserType/Delete/',{"id":id}).subscribe(res=>{
          console.log('UserType Master -> Delete: ',res);
          console.log(res);
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


  //Nav-TabChange
  onTabChange(event:any){
      //reset formState
      this.resetFormData();
      this.buttonText = "Add";
      this.dbOperations = DbOperations.create;
  }

  ngOnDestroy(){
    this.objRows = null;
    this.objRow = null;
  }
}
