import { Injectable } from '@angular/core';
import { SidebarMenuItem } from '../interfaces/sidebar-menu-item';

@Injectable({
  providedIn: 'root'
})
export class SidebarMenuItemService {

  constructor() { }

  //This service is used to return list of sidebarMenuItems (JSON format)
  //Note: This data may come from webApi also
  //We will bind this data in menuItems in sidebarComponent
  SIDEBAR_MENU_ITEMS: SidebarMenuItem[] = [
    //Dashboard
    {title:'Dashboard',icon:'home',itemType:'link',routePath:'dashboard',active:true},

    //Products
    {title:'Products',icon:'box',itemType:'menu',children:[
      {title:'Manage',itemType:'menu',children:[
        {title:'Add Product',itemType:'link',routePath:'products/manage/add-product'},
        {title:'Products List',itemType:'link',routePath:'products/manage/products-list'}
      ]}
    ]},

    //Sales
    {title:'Sales',icon:'dollar-sign',itemType:'menu',children:[
      {title:'Orders',itemType:'link',routePath:'sales/orders'},
      {title:'Transactions',itemType:'link',routePath:'sales/transactions'}
    ]},

    //Masters
    {title:'Masters',icon:'clipboard',itemType:'menu',children:[
      {title:'Brand Logo',itemType:'link',routePath:'/masters/brand-logo'},
      {title:'Category',itemType:'link',routePath:'/masters/category'},
      {title:'Tag',itemType:'link',routePath:'/masters/tag'},
      {title:'Size',itemType:'link',routePath:'/masters/size'},
      {title:'Color',itemType:'link',routePath:'/masters/color'},
      {title:'User Type',itemType:'link',routePath:'/masters/user-type'}
    ]},

    //Users
    {title:'Users',icon:'user-plus',itemType:'menu',children:[
      {title:'Add User',itemType:'link',routePath:'/users/add-user'},
      {title:'Users List',itemType:'link',routePath:'/users/users-list'}
    ]},

    //Invoices
    {title:'Invoices',icon:'archive',itemType:'link',routePath:'invoices'},
    
    //Reports
    {title:'Reports',icon:'bar-chart',itemType:'link',routePath:'reports'},
    
    //Settings
    {title:'Settings',icon:'settings',itemType:'menu',children:[
      {title:'Profile',itemType:'link',routePath:'settings/profile'}
    ]},

    //Logout
    {title:'Logout',icon:'log-out',itemType:'button',actionName:'logout'},
  ]
}
