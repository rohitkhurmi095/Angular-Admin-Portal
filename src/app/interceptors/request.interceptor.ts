import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../components/auth/auth.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor(private _authService:AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //console.log('Request Inteceptor called!');

    //Check if user is loggedIn
    //If user is loggedIn -> modify the request to pass JWT token in header with the request
    //Else -> do not modify the request
    let isLoggedIn:boolean;  //undefined
    let currentUser:any;     //undefined
    let requestModified:any; //undefined
 
    this._authService.isLoggedIn$.subscribe(res=>{
      isLoggedIn = res;

      if(isLoggedIn){
        this._authService.currentUser$.subscribe(res =>{
          currentUser = res;

          if(currentUser!=null){
            //modified request
            requestModified = request.clone({
              setHeaders:{ 
                'Authorization': `Bearer ${currentUser.token}`
              }
            })
            console.log('JWT Token added to the request!');
          }
        })
      }
    })

    //If requestModified is undefined -> pass existing request | else pass the modified request
    return next.handle(requestModified? requestModified: request);
  }
}
