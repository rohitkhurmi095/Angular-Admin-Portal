import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlphaNumericFieldValidator, EmailFieldValidator, MustMatchFieldValidator, NoWhiteSpaceFieldValidator } from 'src/app/shared/validations/validation.validator';
import { AbstractControlOptions } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { Global } from 'src/app/shared/utility/global';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  constructor(private _fb:FormBuilder,private _httpService:HttpService,private _toastr:ToastrService,private _authService:AuthService){}

  //Get Nav TabSet instance from template using @ViewChild
  @ViewChild('nav') elNav:any;

  //FormGroup Instance
  loginForm: FormGroup;
  registerForm: FormGroup;
  registerFormOptions: AbstractControlOptions;
  userTypes:any[];

  ngOnInit(){
    this.setLoginForm();
    this.setRegisterForm();
  }

  setLoginForm(){
    this.loginForm = this._fb.group({
      userName:['',[Validators.required]],
      password:['',[Validators.required]]
    });
  }
  setRegisterForm(){
    //get user Types
    this.getUserTypes();

    this.registerFormOptions = {
      validators: MustMatchFieldValidator('password','confirmPassword')
    }
    this.registerForm = this._fb.group({
      userTypeId:['',[Validators.required]], //for UserType
      firstName:['',Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(15),AlphaNumericFieldValidator.ValidAlphaNumericField,NoWhiteSpaceFieldValidator.ValidNoWhiteSpaceField])],
      lastName:['',Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(15),AlphaNumericFieldValidator.ValidAlphaNumericField,NoWhiteSpaceFieldValidator.ValidNoWhiteSpaceField])],
      email:['',Validators.compose([Validators.required,EmailFieldValidator.ValidEmailField])],
      password:['',Validators.compose([Validators.required,Validators.pattern(/^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).*(?=.*[A-Z]).*(?=.*[a-z]).*(?=.*\d).{8,}$/)])],
      confirmPassword:['',[Validators.required]]
    },this.registerFormOptions)
  }

  //Get formControls
  get loginFormControls(){
    return this.loginForm.controls;
  }
  get registerFormControls(){
    return this.registerForm.controls;
  }

  resetLoginForm(){
    this.loginForm.reset({
      userName:'',
      password:''
    });
  }
  resetRegisterForm(){
    this.registerForm.reset({
      userTypeId:'',
      firstName:'',
      lastName:'',
      email:'',
      password:'',
      confirmPassword:''
    })
  }
  

  //======
  //Login
  //======
  login(){
    if(!this.loginForm.valid){
      return;
    }

    //Call login API
    this._httpService.post(Global.BASE_API_URL+'UserMaster/Login/',this.loginForm.value).subscribe(res =>{
      if(res.isSuccess){
        //console.log('Login: ',res.data);
        this._toastr.success("Login Successful!","Login");
        this.resetLoginForm();

        //call loginService!
        this._authService.login(res.data);
      }else{
        this._toastr.error(res.errors[0],"Login");
      }
    })
  }


  //=========
  //Register
  //=========
  register(){
    if(!this.registerForm.valid){
      return;
    }
    
    //Call Register API
    this._httpService.post(Global.BASE_API_URL+'UserMaster/Save/',this.registerForm.value).subscribe(res=>{
      if(res.isSuccess){   
        //console.log('Register: ',res.data);
        this._toastr.success("Registration Successful!","Register");
        this.resetRegisterForm();

        //Change to loginTab after Registration
        this.elNav.select('loginTab');

      }else{
        this._toastr.error(res.error[0],"Register");
      }
    })
    this.resetRegisterForm();
  }
 
  //--------------
  //Get UserTypes
  //--------------
  getUserTypes(){
    this._httpService.get(Global.BASE_API_URL+'UserType/GetAll').subscribe(res=>{
      console.log('Register -> GetUserTypes: ',res);
      if(res.isSuccess){
        this.userTypes = res.data;
      }else{
        this._toastr.error(res.errors[0],"Register");
      }
    })
  }

  //Nav-TabChange
  onTabChange(event:any){
    if(event.activeId == 'loginTab'){
      //console.log('changed from loginTab!');
      this.resetLoginForm();
    }else{
      //console.log('changed from registerTab');
      this.resetRegisterForm();
    }
  }
}
