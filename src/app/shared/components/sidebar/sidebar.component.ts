import { Component } from '@angular/core';
import { SidebarMenuItemService } from '../../services/sidebar-menu-item.service';
import { SidebarMenuItem } from '../../interfaces/sidebar-menu-item';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  constructor(private _sidebarMenuItemService:SidebarMenuItemService){}

  sidebarMenuItems:SidebarMenuItem[];
  ngOnInit(){
    this.sidebarMenuItems = this._sidebarMenuItemService.SIDEBAR_MENU_ITEMS;
    console.log('sidebarMenuItems: ',this.sidebarMenuItems);
  }

  //for buttonMenu
  performAction(actionName:string){
    console.log('buttonMenu clicked! -> actionName: ',actionName);
  }

  //Open subMenu
  //set 'active' property on specific item to true/false based when that item is clicked!
  //apply 'active' class on the item and 'menu-open' class on child item when that item is clicked!
  openSubMenu(menuItem:any){
    menuItem.active = !menuItem.active;
  }
}
