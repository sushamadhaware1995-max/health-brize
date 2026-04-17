import {Component} from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
// import {ICellRendererAngularComp} from "ag-grid-angular/main";

@Component({
  templateUrl: './link-renderer.component.html',
  styleUrls: ['./link-renderer.component.scss']
})
export class LinkRendererComponent implements ICellRendererAngularComp {
  params: any;
  parentOnClick: any;
  text: string = '';

  constructor() {
  }

  agInit(params: any): void {
    this.params = params;
    if (this.params.colDef.cellRendererFrameworkParams && this.params.colDef.cellRendererFrameworkParams.onClick) {
      this.parentOnClick = this.params.colDef.cellRendererFrameworkParams.onClick;
    }
    this.text = eval("params.data." + params.colDef.field);
  }

  refresh(): boolean {
    return true;
  }

  onClick() {
    if (this.parentOnClick) {
      this.parentOnClick(this.params.data);
    }
    return false;
  }
}
