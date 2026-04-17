import { Component, OnDestroy, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-btn-renderer',
  templateUrl: './btn-renderer.component.html',
  styleUrls: ['./btn-renderer.component.scss']
})
export class BtnRendererComponent implements OnInit,  ICellRendererAngularComp, OnDestroy {

  btnText : string ='';
  btnDesign :any;

  constructor() { }

  refresh(params: ICellRendererParams): boolean {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
  }

  private params: any;

  agInit(params: any): void {
    this.params = params;
    if(params.column.colDef.field === 'isActive'){
      this.btnText  = params.data.isActive === 'Active' ? 'Inactive' : 'Active';
    }
    if(params.column.colDef.field === 'isBlocked'){
      this.btnText  = params.data.isBlocked ? 'Unblock' : 'Block';
    }
    if(this.params.column.colDef.field === 'isVerified'){
      this.btnText  = params.data.isVerified ? 'Approved' : 'Approve';
    }
  }

  btnClickedHandler(event:any) {
    // this.params.clicked(this.params);
    if(this.params.column.colDef.field === 'isActive'){
      this.btnText = this.params.value === 'Active' ? 'Active' : 'Inactive';
    }
    if(this.params.column.colDef.field === 'isBlocked'){
      let params;
      if(this.params.value){
        params = {
          data: this.params.data,
          value: false,
          label: 'Block'
        }
      }else{
        params = {
          data: this.params.data,
          value: true,
          label: 'Block'
        }
      }
      this.params.clicked(params);
      this.btnText = this.params.value ? 'Unblock' : 'Block';
    }
    if(this.params.column.colDef.field === 'isVerified'){
      let params = {
        data: this.params.data,
        label: 'Approve'
      }
      this.params.clicked(params);
      this.btnText = this.params.value ? 'Approved' : 'Approve';
    }

  }

  ngOnDestroy() {
    // no need to remove the button click handler 
    // https://stackoverflow.com/questions/49083993/does-angular-automatically-remove-template-event-listeners
  }

  setStatusColor(): any{
    if( this.btnText === 'Block'){
      return 'block_status';
    }else if(this.btnText === 'Unblock'){
      return 'unblock_status';
    }else if(this.btnText === 'Approve'){
      return 'button pending';
    }else if(this.btnText === 'Approved'){
      return 'button completed';
    }
  }

}
