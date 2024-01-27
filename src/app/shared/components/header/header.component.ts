import { Component, OnInit } from '@angular/core';
import { CollapseSidebarService } from '../../services/collapse-sidebar.service';
import { Global } from '../../utility/global';
import { AuthService } from 'src/app/components/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

  constructor(public _collapseSidebarService:CollapseSidebarService, private _authService:AuthService){}
  
  userDetails:any;
  userImagePath:string;
  ngOnInit(){
    //GET userDetails from localStorage
    this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
    this.userImagePath = this.userDetails.imagePath!=""? Global.BASE_USER_IMAGES_URL+this.userDetails.imagePath : '/assets/images/user.png';
  }

  logout(){
    this._authService.logout();
  }

  collapseSidebar(){
    //console.log('Header align-left icon clicked!');
    this._collapseSidebarService.isCollapsed = !this._collapseSidebarService.isCollapsed;
  }
}
