import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CollapseSidebarService {

  constructor() { }
  
  //when align-left (icon) on header is clicked/unclicked -> add/remove 'open' class to header|layout component
  isCollapsed:boolean = false;
}
