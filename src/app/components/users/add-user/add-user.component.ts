import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup,Validators } from '@angular/forms';
import { AlphaNumericFieldValidator, EmailFieldValidator, MustMatchFieldValidator, NoWhiteSpaceFieldValidator } from 'src/app/shared/validations/validation.validator';
import { ActivatedRoute,Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { DbOperations } from 'src/app/shared/utility/db-operations';
import { Global } from 'src/app/shared/utility/global';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit,OnDestroy {

  componentName:string = "Add User";
  dbOperation:DbOperations;
  buttonText:string = ""

  editId:number;
  objRow:any;
  userTypes:any[];
  
  //Form
  fData:FormGroup;
  formOptions:AbstractControlOptions;
  
  //Form Validations
  formErrors = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userTypeId: ''
  }
  validationMessages = {
    firstName:{
      required: 'First Name is required.',
      minlength: 'First Name must be minimum of 3 characters',
      maxlength: 'First Name cannot exceed 15 characters',
      ValidAlphaNumericField: 'Please enter a valid alphanumeric value!',
      ValidNoWhiteSpaceField: 'Only whitespace characters not allowed!'
    },
    lastName:{
      required: 'Last Name is required.',
      minlength: 'Last Name must be minimum of 3 characters',
      maxlength: 'Last Name cannot exceed 15 characters',
      ValidAlphaNumericField: 'Please enter a valid alphanumeric value!',
      ValidNoWhiteSpaceField: 'Only whitespace characters not allowed!'
    },
    email:{
      required: 'Email is required.',
      ValidEmailField: 'Please enter a valid email!'
    },
    password:{
      required: 'Password is required.',
      pattern: 'Password must contain at least 1 special character, 1 uppercase letter, 1 lowercase letter, and 1 number, with a minimum length of 8 characters.'
    },
    confirmPassword:{
      required: 'Confirm Password is required.',
      MustMatch: 'Confirm Password must be same as the Password!'
    },
    userTypeId:{
      required: 'Please Select User Type!'
    }
  }


  constructor(private _route:ActivatedRoute, private _router:Router, private _httpService:HttpService,private _toastr:ToastrService,private _fb:FormBuilder){
    
    //1.Receive state using navigationExtras of router | Id -> Hidden in URL
    this.editId = this._router.getCurrentNavigation()?.extras?.state?.['id'];
    console.log('Edit User -> Received Id: ',this.editId);

    //2. Receive queryParams of the router using Activated Route | Id -> shows in URL
    // this._route.queryParamMap.subscribe(res =>{
    //   this.editId = parseInt(res.get('id'));
    //   console.log('Edit User -> Received Id: ',this.editId);
    // });
  }

  ngOnInit(){
    //set formData
    this.setFormData();
    //get userTypes
    this.getUserTypes();

    //if EDIT Mode! -> check if Id is received from navigationExtras (state)
    if(this.editId && this.editId!=null && this.editId>0){
      this.buttonText = "Update";
      this.dbOperation = DbOperations.update;
      this.getRecord(this.editId);
    }
  }

  setFormData(){
    this.buttonText = "Add";
    this.dbOperation = DbOperations.create;

    this.formOptions = {
      validators: MustMatchFieldValidator('password','confirmPassword')
    }
    
    this.fData = this._fb.group({
      id:[0], //only required for updateForm
      userTypeId:['',[Validators.required]], //for Admin UserType
      firstName:['',Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(15),AlphaNumericFieldValidator.ValidAlphaNumericField,NoWhiteSpaceFieldValidator.ValidNoWhiteSpaceField])],
      lastName:['',Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(15),AlphaNumericFieldValidator.ValidAlphaNumericField,NoWhiteSpaceFieldValidator.ValidNoWhiteSpaceField])],
      email:['',Validators.compose([Validators.required,EmailFieldValidator.ValidEmailField])],
      password:['',Validators.compose([Validators.required,Validators.pattern(/^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).*(?=.*[A-Z]).*(?=.*[a-z]).*(?=.*\d).{8,}$/)])],
      confirmPassword:['',[Validators.required]]
    },this.formOptions);

    //Apply Dynamic formValidations -> on fromGroup value changes!
    this.fData.valueChanges.subscribe(()=>{
      this.onValueChanges();
    })
  }

  resetFormData(){
   this.fData.reset({
    userTypeId:0,
    firstName:'',
    lastName:'',
    email:'',
    password:'',
    confirmPassword:''
   }); 
  }

  //-------------------
  //Dynamic Validation
  //-------------------
  onValueChanges(){
    //loop through formErrors field's (formControlName's)
    for(let field of Object.keys(this.formErrors)){

      //check form -> all controls must be set
      if(!this.fData){
        return;
      }

      //set field as '' | field = formControlName
      this.formErrors[field] = '';
      //get formControlInstance
      let formControl = this.fData.controls[field];

      if(formControl && ((formControl.touched || formControl.dirty) && formControl.errors)){
        //loop through each error on formControl
        for(let key of Object.keys(formControl.errors)){
          //skip check for required validation
          if(key != 'required'){
            //append validation meesage
            this.formErrors[field] = this.formErrors[field] + this.validationMessages[field][key] + '<br/>';
          }
        }
      }
    }
  }

  cancel(){
    //reset form data | formStage 
    this.resetFormData();
    this.buttonText = "Add";
    this.dbOperation = DbOperations.create;

    //navigate to usersList
    this._router.navigate(['/users/users-list']);
  }

  //getForm Controls
  get formControls(){
    return this.fData.controls;
  }

  //=======
  //Get/Id
  //=======
  getRecord(id:number){
    this._httpService.get(Global.BASE_API_URL+'UserMaster/GetById/'+id).subscribe(res=>{
      console.log('Users -> Get:'+this.editId+': ',res);
      if(res.isSuccess){
        this.objRow = res.data;

        //set editForm Data
        this.fData.patchValue({
          id: this.objRow.id,
          firstName: this.objRow.firstName,
          lastName: this.objRow.lastName,
          email: this.objRow.email,
          userTypeId: this.objRow.userTypeId
        });
      }else{
        this._toastr.error(res.errors[0],this.componentName);
      }
    })
  }

  //--------------
  //Get UserTypes
  //--------------
  getUserTypes(){
    this._httpService.get(Global.BASE_API_URL+'UserType/GetAll').subscribe(res=>{
      console.log('Users -> GetUserTypes: ',res);
      if(res.isSuccess){
        this.userTypes = res.data;
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

    console.log('Form Data:', this.fData);

    switch(this.dbOperation){
      case DbOperations.create:
        //call Save user API
        this._httpService.post(Global.BASE_API_URL+'UserMaster/Save/',this.fData.value).subscribe(res=>{
          console.log('Users -> Save: ',res);
          if(res.isSuccess){
            this._toastr.success("User Added Succesfully!",this.componentName);
            
            //clear form Data | formState
            this.resetFormData();
            this.buttonText = "Add";
            this.dbOperation = DbOperations.create;

            //Navigate to UsersList Page
            this._router.navigate(['/users/users-list']);  
          }else{
            this._toastr.error(res.errors[0],this.componentName);
          }
        }); 
      break;

      case DbOperations.update:
         //call Update user API
         this._httpService.post(Global.BASE_API_URL+'UserMaster/Update/',this.fData.value).subscribe(res=>{
          console.log('Users -> Update: ',res);
          if(res.isSuccess){
            this._toastr.success("User Updated Succesfully!",this.componentName);
             
            //clear form Data | formState
             this.resetFormData();
             this.buttonText = "Add";
             this.dbOperation = DbOperations.create;
 
             //Navigate to UsersList Page
             this._router.navigate(['/users/users-list']);  
          }else{
            this._toastr.error(res.errors[0],this.componentName);
          }
        });
      break;
    }
  }

  ngOnDestroy(){
      this.objRow = null;
  }
}
