import {Component, Input, OnInit} from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'ppc-image-renderer',
  templateUrl: './image-renderer.component.html',
  styleUrls: ['./image-renderer.component.scss']
})
export class ImageRendererComponent implements OnInit, ICellRendererAngularComp  {

  loading: boolean = false;
  error: boolean = false;
  // @Input() styles: string;
  // @Input() imageUrl: string;
  @Input() iconStyle?: string;
  public imageSource!: string;
  public value: any;
  constructor() { }

  ngOnInit() {
    this.loading = true;
    this.error = false;
  }

  // refresh(): boolean {
  //   return false;
  // }

  onLoad() {
    this.loading = false;
  }

  onError() {
    this.loading = false;
    this.error = true;
  }

  private params!: ICellRendererParams;
  private mood!: string;
  public imgForMood!: string;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.setMood(params);
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    this.setMood(params);
    return true;
  }

  private setMood(params: ICellRendererParams) {
    this.mood = params.value;
    this.imgForMood = params.value;
  }

}
