import { Component } from '@angular/core';
import { SidebarMenuItemService } from '../../services/sidebar-menu-item.service';
import { SidebarMenuItem } from '../../interfaces/sidebar-menu-item';
import { Global } from '../../utility/global';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  constructor(private _sidebarMenuItemService:SidebarMenuItemService){}

  shopLogoPath = '/assets/images/logo.png';
  
  userDetails:any;
  userImagePath:string;
  sidebarMenuItems:SidebarMenuItem[];
  ngOnInit(){
    this.sidebarMenuItems = this._sidebarMenuItemService.SIDEBAR_MENU_ITEMS;
    console.log('sidebarMenuItems: ',this.sidebarMenuItems);

     //GET userDetails from localStorage
     this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
     this.userImagePath = this.userDetails.imagePath!=""? Global.BASE_USER_IMAGES_URL+this.userDetails.imagePath : '/assets/images/user.png';
  }

  //for buttonMenu
  performAction(actionName:string){
    console.log('buttonMenu clicked! -> actionName: ',actionName);
    if(actionName == 'logout'){
      this.logout();
    }
  }

  logout(){
    console.log('logout method!');
  }

  //Open subMenu
  //set 'active' property on specific item to true/false based when that item is clicked!
  //apply 'active' class on the item and 'menu-open' class on child item when that item is clicked!
  openSubMenu(menuItem:any){
    menuItem.active = !menuItem.active;
  }
}
