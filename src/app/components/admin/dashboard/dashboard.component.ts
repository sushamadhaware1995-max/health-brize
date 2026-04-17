import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { CommonService } from 'src/app/services/common.service';
import { ImageRendererComponent } from 'src/app/shared/components/image-renderer/image-renderer.component';
import { LinkRendererComponent } from 'src/app/shared/components/link-renderer/link-renderer.component';
import { DisplayService } from 'src/app/shared/services/display.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  //ag-grid variables
  gridOptions: GridOptions = <GridOptions>{} ;
  @Output() selectedItemID = new EventEmitter<any>();
  
  columnDefs: any[] = [
    { 
    field: 'level',
    tooltipField:'level',
    width:100,
    filter: 'agNumberColumnFilter'
  },
  { field: 'location', 
    tooltipField:'location',
    width:100,
    filter: 'agTextColumnFilter',
  },
  { field: 'department', 
    tooltipField:'department',
    width:150,
    filter: 'agTextColumnFilter',
  },
  {
    field: 'itemNumber',
    tooltipField:'itemNumber',
    cellRenderer: LinkRendererComponent,
    cellRendererParams: {
      onClick: (data:any) => {
        this.navigateToItem(data);
      }
    },
    width: 160,
    minWidth: 160
  },
  {
    field: 'emotion',
    cellRenderer: ImageRendererComponent,
    width: 160,
    minWidth: 160
  },
  {
    field: 'edit',
    cellRenderer: () => {
      return `<mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">
      edit</mat-icon>`;
    }
  },
  {
    field: 'delete',
    cellRenderer: () => {
      return `<mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">
      delete</mat-icon>`;
    }
  }
 ];
 rowData:any[] = [];
 rowCount: number = 0;
 fileName: string = 'Events.csv';
 isLoading: boolean = false;
 stats: any;

  constructor(private commonService: CommonService,
    private displayService: DisplayService) {
    this.gridOptions = <GridOptions>{};
    this.rowData = [];
    this.rowCount = this.rowData.length;
   }

  ngOnInit(): void {
    this.getStats();
  }

  navigateToItem(item: any): void {
    this.selectedItemID.emit(item);
  }

  getStats(){
    this.isLoading = true;
    this.commonService.getStats().subscribe(response => {
      this.stats = response;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.displayService.openSnackBar(error.error.message, '', 3000, 'top', 'right', 'danger');
    })
  }

}
