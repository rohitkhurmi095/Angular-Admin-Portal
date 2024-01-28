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
  //for saving data without Image
  public post(url:string,object:any):Observable<any>{
    //convert object -> lightweight format(string) before posting data to API
    const body = JSON.stringify(object);
    return this._http.post(url,body,{
      headers: new HttpHeaders().set('Content-Type','application/json')
    });
  }

  //POST Image 
  //-----------
  //used for saving data with Image using formData object
  //do not convert object -> string (bytes loss) | do not set headers
  //formData = new FormData();
  //formData.append("name",'abc');
  //formData.append("image",uploadedFile,uploadedFileName);
  public postImage(url:string, object:any):Observable<any>{
    return this._http.post(url,object);
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
