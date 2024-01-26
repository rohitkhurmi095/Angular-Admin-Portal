import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  //Common Service for HTTP Operations - GET|POST|PUT|DELETE
  constructor(private _http:HttpClient) { }

  //GET
  //----
  public get(url:string):Observable<any>{
    return this._http.get(url);
  }

  //POST
  //-----
  public post(url:string,object:any):Observable<any>{
    //convert object -> lightweight format(string) before posting data to API
    const body = JSON.stringify(object);
    return this._http.post(url,body,{
      headers: new HttpHeaders().set('Content-Type','application/json')
    });
  }

  //PUT
  //----
  //PUT - modify complete data again 
  //PATCH - modify partial data only
  public put(url:string,id:number,object:any){
    //convert object -> lightweight format(string) before posting data to API
    const body = JSON.stringify(object);
    return this._http.put(url+id,body,{
      headers: new HttpHeaders().set('Content-Type','application/json')
    });
  }

  //DELETE
  //-------
  public delete(url:string,id:number):Observable<any>{
    return this._http.delete(url+id);
  }
}
