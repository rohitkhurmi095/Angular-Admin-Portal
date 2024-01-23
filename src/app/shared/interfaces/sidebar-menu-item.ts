//Interface (Model) - for sidebarMenuItems
export interface SidebarMenuItem {
   title:string,
   icon?:string,                    //can be optional for subItems
   itemType:string,                //menu,link,button
   routePath?:string,             //only required for itemType = 'link'
   actionName?:string,           //only required for itemType = 'button'
   children?:SidebarMenuItem[], //if menu has subMenu
   active?:boolean;            //to apply activeClass on menuItem
}
