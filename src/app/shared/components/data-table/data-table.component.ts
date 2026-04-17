import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GridOptions, CsvExportParams } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { MatOption } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteModalObj } from '../../models/deleteModalObj';
import { ActionMsg } from '../../models/actionMsg';
import { AddEditUserComponent } from 'src/app/components/admin/user/add-edit-user/add-edit-user.component';
import { AddEditCategoryComponent } from 'src/app/components/admin/category/add-edit-category/add-edit-category.component';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { ViewOrderComponent } from 'src/app/components/admin/orders/view-order/view-order.component';
import { AddEditProductComponent } from 'src/app/components/admin/products/add-edit-product/add-edit-product.component';
import { AddEditSubCategoryComponent } from 'src/app/components/admin/sub-category/add-edit-sub-category/add-edit-sub-category.component';
import { AddEditDoctorComponent } from 'src/app/components/admin/doctor/add-edit-doctor/add-edit-doctor.component';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {

  @Output() isActionPerformed = new EventEmitter<any>();
  // @Output() isRefreshPerformed = new EventEmitter<any>();
  @Input() rowData: any[] | undefined;
  @Input() columnDefs: any[] = [];
  @Input() gridOptions: GridOptions;
  @Input() component: Component | undefined;
  @Input() isDeleteUnClicked: boolean = false;
  @Input() isAddButtonRequired: boolean = false;
  @Input() isExportButtonRequired: boolean = false;
  @Input() isShowExportCSVButton: boolean = true;
  @Input() isShowHeader: boolean = true;
  @Input() isPaginationRequired: boolean = false;
  @Input() isExportRequired: boolean = false;
  @Input() isColumnPrefRequired: boolean = false;
  @Input() isLaunchEventRequired: boolean = false;
  @Input() isRowSelection: string = '';
  @Output() isRowClickedToViewData = new EventEmitter();
  @Output() isRowClickedToDeleteData = new EventEmitter();
  @Output() isRowClickedToEditData = new EventEmitter();
  @Output() isAddButtonClicked = new EventEmitter();
  @Input() fileName: string = '';
  @Input() fitColumns: boolean = false;
  isAsync: boolean = true;
  @Input() isAddActionRequired: boolean = false;
  @Input() actionBtnText: string = '';
  @Input() componentName: string = '';
  @Input() deleteModalData: DeleteModalObj = {
    title: '',
    msg: '',
    icon: '',
    errorMsg: '',
    successMsg: ''
  };

  @Input() addActionMsg: ActionMsg = {
    errorMsg: '',
    successMsg: ''
  }

  @Input() updateActionMsg: ActionMsg = {
    errorMsg: '',
    successMsg: ''
  }

  @Input() addBtnIcon: string = '';

  @Input() columnKeys: string[] = [];

  //pop-up variables
  deleteColumnClicked: boolean = false;
  editColumnClicked: boolean = false;

  // filter variables
  @ViewChildren('input') input = '';
  searchTextChanged: EventEmitter<any> = new EventEmitter();
  maxLength: number = 0;
  showTotal: boolean = false;
  filterCleared: EventEmitter<any> = new EventEmitter();
  iconFilter: boolean = false;
  searchText: any = '';
  showSelectedNoOfRows: boolean = false;
  selectedItemsCount: number = 0;
  @Input() rowCount: number | undefined;

  //column-filter variables
  selectedColumns: any[] = [];
  columns: any[] = [];
  @Output() columnData = new EventEmitter<any[]>();
  @Input('columnOptions') columnOptions: any[] = [];
  @Input('viewName') viewName: any;
  isPreferenceExist: boolean = false;
  responseData: any;
  checked: boolean = true;
  columnForFiltering: any[] = [];
  unselectedColmuns: any[] = [];

  //launch event variables
  searchEventForm!: FormGroup;
  eventListForLaunching: any[] = [];
  userListForLaunching: any[] = [];
  isEventAbled: boolean = false;
  isUserAbled: boolean = false;
  @ViewChild('allSelected') private allSelected: MatOption | undefined;

  constructor(public dialog: MatDialog, private fb: FormBuilder, public snackBar: MatSnackBar) {
    this.gridOptions = <GridOptions>{};
  }

  ngOnChanges() {
    this.deleteColumnClicked = this.isDeleteUnClicked;
  }

  ngOnInit(): void {
    this.gridOptions.rowHeight = 32;
    this.gridOptions.headerHeight = 50;
    if (this.gridOptions.api) {
      this.gridOptions.api.setColumnDefs(this.columnDefs);
      this.gridOptions.api.sizeColumnsToFit();
    }
    if (!this.gridOptions.defaultColDef) {
      this.gridOptions.defaultColDef = {};
    }
    this.gridOptions.defaultColDef.sortable = true;
    this.gridOptions.defaultColDef.resizable = true;

    // this.gridOptions.enableCellTextSelection = true;
    // this.gridOptions.suppressCellSelection = false;
    // this.gridOptions.defaultColDef.suppressSizeToFit = false;
    // this.gridOptions.api?.sizeColumnsToFit();
    this.gridOptions.suppressRowClickSelection = true;
    this.isAsync = this.rowData instanceof Observable;
    if (this.fitColumns) {
      let oldGridReadyEvent = this.gridOptions.onGridReady;
      this.gridOptions.onGridReady = (params) => {
        this.sizeColumnsToFit();
        if (oldGridReadyEvent) {
          oldGridReadyEvent(params);
        }
      };
      this.gridOptions.onGridSizeChanged = () => this.sizeColumnsToFit();
    }
    this.gridOptions.paginationPageSize = 15;
    this.gridOptions.pagination = this.isPaginationRequired;
    this.columnForFiltering = JSON.parse(JSON.stringify(this.columnDefs));
    this.columnOptions.forEach((col: any) => {
      if (col.field) {
        this.columns.push({ tooltipField: col.tooltipField, field: col.field, width: col.width })
      }
      else {
        this.columns.push({ headerName: col.headerName, children: col.children })
      }
    })
    this.searchEventForm = this.fb.group({
      userType: new FormControl('')
    });
  }

  sizeColumnsToFit() {
    //This is a fix, without this piece of code, the ag-grid tries to fit columns before the grid is loaded.
    setTimeout(() => {
      if (this.gridOptions && this.gridOptions.api) {
        this.gridOptions.api.sizeColumnsToFit();
      }
    }, 100);
  }

  onChecked(data: any) {
    if (this.unselectedColmuns.length > 0) {
      let index = this.unselectedColmuns.indexOf(data);
      this.unselectedColmuns.indexOf(data) === -1 ? this.unselectedColmuns.push(data) : this.unselectedColmuns.splice(index, 1);;
    }
    else {
      this.unselectedColmuns.push(data);
    }
    let col: any[] = JSON.parse(JSON.stringify(this.columnForFiltering));
    for (let i = 0; i < this.unselectedColmuns.length; i++) {
      if (this.unselectedColmuns[i].field) {
        let index = col.findIndex(item => item.field === this.unselectedColmuns[i].field);
        col.splice(index, 1);
      }
      if (this.unselectedColmuns[i].headerName) {
        let index = col.findIndex(item => item.headerName === this.unselectedColmuns[i].headerName);
        col.splice(index, 1);
      }
    }
    this.columnDefs = col;
  }

  onRowClicked(event: any) {
    if (
      event.type === 'rowClicked' &&
      !this.deleteColumnClicked &&
      !this.editColumnClicked
    ) {
      this.isRowClickedToViewData.emit(event.node.data);
    }
  }

  onSearchTextChanged(searchText: any) {
    let text = searchText.target.value;
    this.searchText = text;
    if (this.gridOptions.api) {
      this.gridOptions.api.setQuickFilter(text);
      this.searchTextChanged.emit(text);
      this.rowCount = this.gridOptions.api.getDisplayedRowCount();
    }
  }

  onClearSearchText() {
    this.searchText = '';
    if (this.gridOptions.api) {
      this.gridOptions.api.setQuickFilter('');
      this.searchTextChanged.emit('');
    }
    if (this.gridOptions.api) {
      this.rowCount = this.gridOptions.api.getDisplayedRowCount();
    }
  }

  onBtnExport() {
    if (this.componentName === 'UserComponent') {
      let params = <CsvExportParams>{
        allColumns: false,
        fileName: this.fileName,
        columnKeys: this.columnKeys
      };
      this.gridOptions.api?.exportDataAsCsv(params);
    }

    if (this.componentName === 'CategoryComponent') {
      let params = <CsvExportParams>{
        allColumns: false,
        fileName: this.fileName,
        columnKeys: this.columnKeys
      };
      this.gridOptions.api?.exportDataAsCsv(params);
    }

    if (this.componentName === 'SubCategoryComponent') {
      let params = <CsvExportParams>{
        allColumns: false,
        fileName: this.fileName,
        columnKeys: this.columnKeys
      };
      this.gridOptions.api?.exportDataAsCsv(params);
    }

    if (this.componentName === 'ProductsComponent') {
      let params = <CsvExportParams>{
        allColumns: false,
        fileName: this.fileName,
        columnKeys: this.columnKeys
      };
      this.gridOptions.api?.exportDataAsCsv(params);
    }

    if (this.componentName === 'OrdersComponent') {
      let params = <CsvExportParams>{
        allColumns: false,
        fileName: this.fileName,
        columnKeys: this.columnKeys
      };
      this.gridOptions.api?.exportDataAsCsv(params);
    }

    if (this.componentName === 'DoctorComponent') {
      let params = <CsvExportParams>{
        allColumns: false,
        fileName: this.fileName,
        columnKeys: this.columnKeys
      };
      this.gridOptions.api?.exportDataAsCsv(params);
    }
  }

  onSelectionChanged(event: any) {
    this.userListForLaunching = [];
    let selectedRows = this.gridOptions.api?.getSelectedNodes();
    for (let i = 0; i < selectedRows!.length; i++) {
      this.userListForLaunching.push(selectedRows![i].data);
    }
    if (this.userListForLaunching.length > 0) {
      this.isUserAbled = true;
    }
    else {
      this.isUserAbled = false;
    }
  }

  rowClicked(event: any) {

    // Orders View
    if (this.componentName === 'OrdersComponent') {
      let orderDetails = {
        component: this.componentName,
        data: event.data,
        action: 'view'
      }
      if (event.colDef.field === "viewOrder") {
        this.dialog.open(ViewOrderComponent, {
          data: orderDetails
        });
      }
    }

    // Users Edit, View, Delete
    if (this.componentName === 'UserComponent') {
      if (event.colDef.field === "userEdit") {
        let updateUSerModalData = {
          modalMSg: this.updateActionMsg,
          component: this.componentName,
          data: event.data
        }
        const dialogRef = this.dialog.open(AddEditUserComponent, {
          data: updateUSerModalData
        });
        dialogRef.afterClosed().subscribe(result => {
          this.isActionPerformed.emit(result);
        });
      }
      if (event.colDef.field === "userView") {
        let updateUSerModalData = {
          component: this.componentName,
          data: event.data,
          action: 'viewOnly'
        }
        this.dialog.open(AddEditUserComponent, {
          data: updateUSerModalData
        });
      }
      if (event.colDef.field === "userDelete") {
        let deleteModalData = {
          modalMsg: this.deleteModalData,
          details: event.data,
          component: this.componentName
        }
        const dialogRef = this.dialog.open(DeleteModalComponent, {
          data: deleteModalData,
          width: '25vw'
        });
        dialogRef.afterClosed().subscribe(result => {
          this.isActionPerformed.emit(result);
        });
      }
    }

    // Categories Edit, View, Delete
    if (this.componentName === 'CategoryComponent') {
      if (event.colDef.field === "categoryEdit") {
        let updateCategoryModalData = {
          modalMSg: this.updateActionMsg,
          component: this.componentName,
          data: event.data
        }
        const dialogRef = this.dialog.open(AddEditCategoryComponent, {
          data: updateCategoryModalData
        });
        dialogRef.afterClosed().subscribe(result => {
          this.isActionPerformed.emit(result);
        });
      }
      if (event.colDef.field === "categoryView") {
        let updateUSerModalData = {
          component: this.componentName,
          data: event.data,
          action: 'viewOnly'
        }
        this.dialog.open(AddEditCategoryComponent, {
          data: updateUSerModalData
        });
      }
      if (event.colDef.field === "categoryDelete") {
        let deleteModalData = {
          modalMsg: this.deleteModalData,
          details: event.data,
          component: this.componentName
        }
        const dialogRef = this.dialog.open(DeleteModalComponent, {
          data: deleteModalData,
          width: '25vw'
        });
        dialogRef.afterClosed().subscribe(result => {
          this.isActionPerformed.emit(result);
        });
      }
    }

    // SubCategories Edit, View, Delete
    if (this.componentName === 'SubCategoryComponent') {
      if (event.colDef.field === "subCategoryEdit") {
        let updateCategoryModalData = {
          modalMSg: this.updateActionMsg,
          component: this.componentName,
          data: event.data
        }
        const dialogRef = this.dialog.open(AddEditSubCategoryComponent, {
          data: updateCategoryModalData
        });
        dialogRef.afterClosed().subscribe(result => {
          this.isActionPerformed.emit(result);
        });
      }
      if (event.colDef.field === "subCategoryView") {
        let updateUSerModalData = {
          component: this.componentName,
          data: event.data,
          action: 'viewOnly'
        }
        this.dialog.open(AddEditSubCategoryComponent, {
          data: updateUSerModalData
        });
      }
      if (event.colDef.field === "subCategoryDelete") {
        let deleteModalData = {
          modalMsg: this.deleteModalData,
          details: event.data,
          component: this.componentName
        }
        const dialogRef = this.dialog.open(DeleteModalComponent, {
          data: deleteModalData,
          width: '25vw'
        });
        dialogRef.afterClosed().subscribe(result => {
          this.isActionPerformed.emit(result);
        });
      }
    }

    if(this.componentName === 'ProductsComponent'){
      if (event.colDef.field === "productView") {
        let updateUSerModalData = {
          component: this.componentName,
          data: event.data,
          action: 'viewOnly'
        }
        this.dialog.open(AddEditProductComponent, {
          data: updateUSerModalData
        });
      }
      if (event.colDef.field === "productEdit") {
        let updateUSerModalData = {
          component: this.componentName,
          data: event.data
        }
        const dialogRef = this.dialog.open(AddEditProductComponent, {
          data: updateUSerModalData
        });
        dialogRef.afterClosed().subscribe(result => {
          this.isActionPerformed.emit(result);
        });
      }
      if (event.colDef.field === "productDelete") {
        let deleteModalData = {
          modalMsg: this.deleteModalData,
          details: event.data,
          component: this.componentName
        }
        const dialogRef = this.dialog.open(DeleteModalComponent, {
          data: deleteModalData,
          width: '25vw'
        });
        dialogRef.afterClosed().subscribe(result => {
          this.isActionPerformed.emit(result);
        });
      }
    }

    // Approve Users View
    if (this.componentName === 'ApproveUsersComponent') {
      if (event.colDef.field === "userView") {
        let viewUserDetails = {
          component: this.componentName,
          data: event.data,
          action: 'viewOnly'
        }
        this.dialog.open(AddEditUserComponent, {
          data: viewUserDetails
        });
      }
    }

     // Doctors Edit, View, Delete
     if (this.componentName === 'DoctorComponent') {
      if (event.colDef.field === "doctorEdit") {
        let updateUSerModalData = {
          modalMSg: this.updateActionMsg,
          component: this.componentName,
          data: event.data
        }
        const dialogRef = this.dialog.open(AddEditDoctorComponent, {
          data: updateUSerModalData
        });
        dialogRef.afterClosed().subscribe(result => {
          this.isActionPerformed.emit(result);
        });
      }
      if (event.colDef.field === "doctorView") {
        let updateUSerModalData = {
          component: this.componentName,
          data: event.data,
          action: 'viewOnly'
        }
        this.dialog.open(AddEditDoctorComponent, {
          data: updateUSerModalData
        });
      }
      if (event.colDef.field === "doctorDelete") {
        let deleteModalData = {
          modalMsg: this.deleteModalData,
          details: event.data,
          component: this.componentName
        }
        const dialogRef = this.dialog.open(DeleteModalComponent, {
          data: deleteModalData,
          width: '25vw'
        });
        dialogRef.afterClosed().subscribe(result => {
          this.isActionPerformed.emit(result);
        });
      }
    }
  }

  openAddModal(): any {

    //Add User
    if (this.componentName === 'UserComponent') {
      let addUserModalData = {
        modalMsg: this.addActionMsg,
        component: this.componentName
      }
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.data = addUserModalData;
      dialogConfig.width = '65vw';
      return this.dialog.open(AddEditUserComponent, dialogConfig);
    }

    //Add category
    if (this.componentName === 'CategoryComponent') {
      let addCategoryModalData = {
        modalMsg: this.addActionMsg,
        component: this.componentName
      }
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.data = addCategoryModalData;
      const dialogRef = this.dialog.open(AddEditCategoryComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        this.isActionPerformed.emit(result);
      });
    }

    if (this.componentName === 'SubCategoryComponent') {
      let addCategoryModalData = {
        modalMsg: this.addActionMsg,
        component: this.componentName
      }
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.data = addCategoryModalData;
      const dialogRef = this.dialog.open(AddEditSubCategoryComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        this.isActionPerformed.emit(result);
      });
    }

    //Add Product
    if (this.componentName === 'ProductsComponent') {
      let addProductModalData = {
        modalMsg: this.addActionMsg,
        component: this.componentName
      }
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.data = addProductModalData;
      const dialogRef = this.dialog.open(AddEditProductComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        this.isActionPerformed.emit(result);
      });
    }

    //Add doctor
    if (this.componentName === 'DoctorComponent') {
      let addProductModalData = {
        modalMsg: this.addActionMsg,
        component: this.componentName
      }
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.data = addProductModalData;
      const dialogRef = this.dialog.open(AddEditDoctorComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        this.isActionPerformed.emit(result);
      });
    }
  }

  refresh(){
      this.isActionPerformed.emit(true);
  }
}
