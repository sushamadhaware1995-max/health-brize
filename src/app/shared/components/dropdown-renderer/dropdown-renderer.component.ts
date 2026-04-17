import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-dropdown-renderer',
  templateUrl: './dropdown-renderer.component.html',
  styleUrls: ['./dropdown-renderer.component.scss']
})
export class DropdownRendererComponent implements OnInit, ICellRendererAngularComp {

  private params: any;
  values: any[] = [];
  selected: any;

  constructor() { }

  refresh(params: ICellRendererParams): boolean {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
  }

  agInit(params: any): void {
    this.params = params;
    if(this.params.type === 'Order'){
      this.values = [
        {
          value: 'booked',
          displayName: 'Booked'
        },
        {
          value: 'delivered',
          displayName: 'Delivered'
        },
        {
          value: 'canceled',
          displayName: 'Cancelled'
        },
        {
          value: 'other',
          displayName: 'Other'
        }
      ];
    }
    this.selected = this.values.filter(value => value.value === this.params.value)[0];
  }

  selectValue(event: any){
    this.params.value = event.target.value;
    this.params.change(this.params);
  }
}
