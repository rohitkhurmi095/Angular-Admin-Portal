import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  constructor(private _fb:FormBuilder){}

  //FormGroup Instance
  loginForm: FormGroup;
  registerForm: FormGroup;

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
    this.registerForm = this._fb.group({
      userTypeId:[1], //for Admin UserType
      firstName:['',Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(15)])],
      lastName:['',Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(15)])],
      email:['',Validators.compose([Validators.required])],
      password:['',Validators.compose([Validators.required,Validators.pattern(/^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).*(?=.*[A-Z]).*(?=.*[a-z]).*(?=.*\d).{8,}$/)])],
      confirmPassword:['',[Validators.required]]
    })
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
      userTypeId:1,
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

    console.log(this.loginForm.value);
    this.resetLoginForm();
  }


  //=========
  //Register
  //=========
  register(){
    if(!this.registerForm.valid){
      return;
    }
    
    console.log(this.registerForm.value);
    this.resetRegisterForm();
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
