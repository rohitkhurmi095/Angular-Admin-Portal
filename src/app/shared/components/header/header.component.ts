import { Component, OnInit } from '@angular/core';
import { CollapseSidebarService } from '../../services/collapse-sidebar.service';
import { Global } from '../../utility/global';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

  constructor(public _collapseSidebarService:CollapseSidebarService){}
  
  userDetails:any;
  userImagePath:string;
  ngOnInit(){
    //GET userDetails from localStorage
    this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
    this.userImagePath = this.userDetails.imagePath!=""? Global.BASE_USER_IMAGES_URL+this.userDetails.imagePath : '/assets/images/user.png';
  }

  logout(){
    console.log('logout method!');
  }

  collapseSidebar(){
    //console.log('Header align-left icon clicked!');
    this._collapseSidebarService.isCollapsed = !this._collapseSidebarService.isCollapsed;
  }
}
