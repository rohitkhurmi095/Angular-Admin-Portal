import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LayoutComponent } from './layout/layout.component';
import { Error404Component } from './error404/error404.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [

  
    HeaderComponent,
        FooterComponent,
        BreadcrumbComponent,
        SidebarComponent,
        LayoutComponent,
        Error404Component
  ],
  imports: [
    CommonModule,
    RouterModule //to use router-links
  ]
})
export class SharedModule { }
