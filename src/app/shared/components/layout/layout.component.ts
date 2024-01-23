import { Component } from '@angular/core';
import { CollapseSidebarService } from '../../services/collapse-sidebar.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  constructor(public _collapseSidebarService:CollapseSidebarService){}
}
