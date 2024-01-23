import { Component, OnInit } from '@angular/core';
import { CollapseSidebarService } from '../../services/collapse-sidebar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent{

  constructor(public _collapseSidebarService:CollapseSidebarService){}

  userImagePath = '/assets/images/user.png';

  logout(){
    console.log('logout method!');
  }

  collapseSidebar(){
    //console.log('Header align-left icon clicked!');
    this._collapseSidebarService.isCollapsed = !this._collapseSidebarService.isCollapsed;
  }
}
