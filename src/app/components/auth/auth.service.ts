import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //BehaviourSubjects for login!
  //Note: currentUser BehaviourSubject is also used to get JWT token from currentUser in request Interceptor
  private currentUser:BehaviorSubject<any> = new BehaviorSubject(null); 
  private isLoggedIn:BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private _router:Router,private _toastr:ToastrService) {

    //Get userDetails from localStorage!
    //if userDetails in localStorage!=null -> set userDetails in behaviourSubject 
    //so that user is not logged out until logged out using logout button!
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if(userDetails!=null){
      console.log('user is already loggedIn!');
      this.currentUser.next(userDetails);
      this.isLoggedIn.next(true);
    }
  }

  //------
  //Login
  //------
  //Note: LoginAPI -> userDetails contains JWT token which is passed as header to other API Calls!
  login(userDetails:any){
    //Set UserDetails in localStorage and BehaviourSubject!
    localStorage.setItem("userDetails",JSON.stringify(userDetails));
    this.currentUser.next(userDetails);
    this.isLoggedIn.next(true);

    //Navigate to Dashboard
    this._router.navigate(['dashboard']);
  }

  //=======
  //Logout
  //=======
  logout(){
    //clear localStorage and BehaviourSubject
    localStorage.clear();
    this.currentUser.next(null);
    this.isLoggedIn.next(false);

    //Navigate to Authentication Page!
    this._toastr.success("LogOut Successful!","LogOut");
    this._router.navigate(['auth/login']);
  }


  //Convert BehaviourSubjects -> Observables! 
  //Also know as readOnly BehaviourSubjects
  get currentUser$(){
    return this.currentUser.asObservable();
  }
  get isLoggedIn$(){
    return this.isLoggedIn.asObservable();
  }
}
