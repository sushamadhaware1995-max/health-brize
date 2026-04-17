import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-tag-renderer',
  templateUrl: './tag-renderer.component.html',
  styleUrls: ['./tag-renderer.component.scss']
})
export class TagRendererComponent implements OnInit {

  btnText : string ='';
  btnDesign :any;
  private params: any;
  values: string[] = [];
  constructor() { }

  refresh(params: ICellRendererParams): boolean {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
  }


  agInit(params: any): void {
    this.params = params;
    if(this.params.type === 'Order'){
      this.values.push(this.params.value);
    }else if(this.params.type === 'Category'){
      this.values = this.params.data.purities;
    }
    // else if(this.params.type === 'Products'){
    //   this.values = this.params.data.purities;
    // }
  }
}
