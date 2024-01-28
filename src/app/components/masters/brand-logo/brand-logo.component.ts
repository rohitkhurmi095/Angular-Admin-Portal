import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { DbOperations } from 'src/app/shared/utility/db-operations';
import { Global } from 'src/app/shared/utility/global';
import { CharFieldValidator, NoWhiteSpaceFieldValidator } from 'src/app/shared/validations/validation.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-brand-logo',
  templateUrl: './brand-logo.component.html',
  styleUrls: ['./brand-logo.component.scss']
})
export class BrandLogoComponent {

  constructor(private _fb:FormBuilder,private _httpService:HttpService, private _toastr:ToastrService){}

  @ViewChild('nav') elNav:any;    //nav templateRef variable
  componentName = 'Brand Logo Master';
  buttonText = "";                //buttonText
  dbOperations:DbOperations;     //dbOperation
  fData:FormGroup;              //FormGroup Instance
  objRows:any[];               //for allData
  objRow:any;                 //for singleData
  uploadedImage :File;         //uploaded image

  //UploadPreview Image
  uploadImagePreview:string = '/assets/images/noimage.png';

  //Form Validations
  formErrors = {
    name:''
  }
  validationMessages = {
    name: {
      required:'Name is required.',
      minlength:'Name must be minimum of 2 characters',
      maxlength:'Name cannot exceed 12 characters',
      ValidCharField: 'Name must be contains char and space only!',
      ValidNoWhiteSpaceField:'Only whitespace characters not allowed!'
    }
  }

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
      name:['',Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(12),CharFieldValidator.ValidCharField,NoWhiteSpaceFieldValidator.ValidNoWhiteSpaceField])]
    })
    
    //When formGroup valueChanges! -> check and apply validations!
    this.fData.valueChanges.subscribe(res=>{
      this.onValueChanges();
    });
  }

  onValueChanges(){
    //loop through formErrors field's (formControlName's)
    for(const field of Object.keys(this.formErrors)){
      //check if form is not undefined -> valid form
      if(!this.fData){
        return;
      }
        
      //set message to ''
      this.formErrors[field]='';
      //get formControl instance from formControlName
      const formControl = this.fData.get(field);
        
      //check conditions for validations 
      if(formControl && ((formControl.touched || formControl.dirty) && formControl.errors)){
        //loop through all errors applied on formControl
        for(let key of Object.keys(formControl.errors)){
          //skip check for required validation as this is not detected at 1st time in valueChanges
          if(key !== 'required'){
              //append validation message
              this.formErrors[field] = this.formErrors[field] + this.validationMessages[field][key] + '<br/>';
          }
        }
      }
    }
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
  
  //-------------
  //Image Upload
  //-------------
  //access image templateRef varaible using @viewChild
  @ViewChild('image') elImage:ElementRef;
  uploadImage(event:any){
    let files = event.target.files;
    let file = files[0];
    let fileType = file.type;
    const imageTypeRegx = /image\/*/;

    //check fileLength
    if(files.length === 0){
      return;
    }

    //check fileType | if invalid -> show error | clear fileInput | reset default uploadImagePreview
    if(!fileType.match(imageTypeRegx)){
      this._toastr.error("Please upload a valid image file.",this.componentName);
      this.elImage.nativeElement.value = "";
      this.uploadImagePreview = '/assets/images/noimage.png';
      return;
    }
    
    //set file
    this.uploadedImage = file;

    //read fileData and assign this to uploadImagePreview using javascript fileReaderAPI
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.uploadImagePreview = reader.result.toString();
    }
  }


  //========
  //Get All
  //========
  getAllRecords(){
    //call GetAll API!
    //** Note:
    //Image path returned from API: '/Shop/Images' 
    //this will only work for default images - createdOn: 07/12/2019
    //for any new added/updated image path of saving is: '/Images' but path returned from API is still '/Images/Shop'
    //replace the path for new images accordingly
    this._httpService.get(Global.BASE_API_URL+'BrandLogo/GetAll').subscribe(res=>{
      console.log('BrandLogo -> GetAll: ',res);
      if(res.isSuccess){
        this.objRows = res.data.map(x => {
          if (x.createdOn !== "07/12/2019") {
            x.imagePath = x.imagePath.replace('/Images/Shop', '/Images');
          }
          return x;
        });
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
    
    if(this.dbOperations == DbOperations.create && !this.uploadedImage){
      this._toastr.error("Please Upload a Image!",this.componentName);
      return;
    }

    //set formData with image
    let formData:FormData = new FormData();
    formData.append("id",this.fData.value.id);
    formData.append("name",this.fData.value.name);
    formData.append("image",this.uploadedImage,this.uploadedImage.name);

    switch(this.dbOperations){
      case DbOperations.create:
        //call Save API!
        this._httpService.postImage(Global.BASE_API_URL+'BrandLogo/Save/',formData).subscribe(res=>{
          console.log('BrandLogo -> Save: ',res);
          if(res.isSuccess){
            this._toastr.success("Record Saved Succssfully!",this.componentName);
            
            //reset formState
            this.resetFormData();
            this.buttonText = "Add";
            this.dbOperations = DbOperations.create;
            //image
            this.elImage.nativeElement.value = "";
            this.uploadImagePreview = '/assets/images/noimage.png';

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
        this._httpService.postImage(Global.BASE_API_URL+'BrandLogo/Update/',formData).subscribe(res=>{
          console.log('BrandLogo -> Update: ',res);
          if(res.isSuccess){
            this._toastr.success("Record Updated Succssfully!",this.componentName);

             //reset formState
             this.resetFormData();
             this.buttonText = "Add";
             this.dbOperations = DbOperations.create; 
             //image
             this.elImage.nativeElement.value = "";
             this.uploadImagePreview = '/assets/images/noimage.png';

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
    //image
    this.elImage.nativeElement.value = "";
    this.uploadImagePreview = '/assets/images/noimage.png';

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
      name:this.objRow.name,
    });
    //image
    this.uploadImagePreview = this.objRow.imagePath;

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
        this._httpService.post(Global.BASE_API_URL+'BrandLogo/Delete/',{"id":id}).subscribe(res=>{
          console.log('BrandLogo -> Delete: ',res);
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
      //image
      this.elImage.nativeElement.value = "";
      this.uploadImagePreview = '/assets/images/noimage.png';
  }

  ngOnDestroy(){
    this.objRows = null;
    this.objRow = null;
  }
}
