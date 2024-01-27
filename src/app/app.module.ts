import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { RequestInterceptor } from './interceptors/request.interceptor';
import { ResponseInterceptor } from './interceptors/response.interceptor';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule, //Eagar Loading
    ToastrModule.forRoot(), //for toastr notifications
    HttpClientModule //for http API Calls
  ],
  providers: [
    //Interceptors -> called in sequence
    {provide:HTTP_INTERCEPTORS,useClass:RequestInterceptor, multi:true},
    {provide:HTTP_INTERCEPTORS,useClass:ResponseInterceptor,multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
