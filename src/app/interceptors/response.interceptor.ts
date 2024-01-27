import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, map, retry, throwError } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //console.log('Response Interceptor called!');

    //Retry 3 times
    //Check if response is returned 
    //Perform error handling - check clientSide | serverSide Errors!
    return next.handle(request).pipe(
      //Retry 3 times!
      retry(3),
      //Checking Valid Response
      map(res=>{
        if(res instanceof HttpResponse){
          return res;
        }
        return null;
      }),
      //Error Handling
      catchError((error:HttpErrorResponse)=>{
        let errorMessage = '';
        if(error.error instanceof HttpErrorResponse){
          //ClientSide Error!
          console.log('Response Interceptor Called! -> ClientSide Error:');
          errorMessage = `Error Message: ${error.error.message}`;
        }else{
          //ServerSide Error!
          console.log('Response Interceptor Called! -> ServerSide Error:');
          errorMessage = `Error Message: ${error.message} | Status: ${error.status}`
        }
        return throwError(()=>Error(errorMessage));
      })
    );
  }
}
