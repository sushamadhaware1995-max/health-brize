import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BtnRendererComponent } from 'src/app/shared/components/btn-renderer/btn-renderer.component';
import { ActionMsg } from 'src/app/shared/models/actionMsg';
import { DeleteModalObj } from 'src/app/shared/models/deleteModalObj';
import { DisplayService } from 'src/app/shared/services/display.service';
import { DoctorService } from './doctor.service';
import { GridOptions } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent implements OnInit {

  gridOptions: GridOptions = <GridOptions>{};
  @Output() selectedItemID = new EventEmitter<any>();
  subscriptions: Subscription | undefined;
  deleteModalObj: DeleteModalObj = {
    title: 'Delete Doctor',
    msg: 'Do you really want to delete this doctor? This process cannot be undone.',
    icon: 'delete',
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    errorMsg: 'Error occurred while deleting doctor',
    successMsg: 'User deleted successfully'
  }
  addActionMsg: ActionMsg = {
    errorMsg: 'Error occurred while adding new doctor',
    successMsg: 'Doctor added successfully'
  }

  updateActionMsg: ActionMsg = {
    errorMsg: 'Error occurred while updating doctor',
    successMsg: 'Doctor details updated successfully'
  }
  doctors: any[] | undefined;
  isLoading: boolean = false;
  upgradeGrid: boolean = true;
  rowCount: number = 0;
  fileName: string = 'Doctors.csv';
  addBtnIcon: string = 'person_add';
  addUserBtnText: string = 'Add Doctor';
  component: string = 'DoctorComponent';
  deleteModalData: DeleteModalObj | undefined;
  columnKeys: string[] = ["isActive", "isBlocked", "name", "phoneNumber", "email", "address.address",
    "address.city", "address.state", "address.country", "address.pincode"];
  columnDefs: any[] = [
    {
      headerName: 'Actions',
      children: [
        {
          headerName: 'Block',
          field: 'isBlocked',
          cellRenderer: BtnRendererComponent,
          cellRendererParams: {
            clicked: this.openConfirmationModal.bind(this)
          },
          width: 120
        },
        {
          headerName: 'View',
          field: 'doctorView',
          width: 80,
          cellRenderer: () => {
            return `<mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">
            visibility</mat-icon>`;
          }
        },
        {
          headerName: 'Edit',
          field: 'doctorEdit',
          width: 80,
          cellRenderer: () => {
            return `<mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">
            edit</mat-icon>`;
          }
        },
        {
          headerName: 'Delete',
          field: 'doctorDelete',
          width: 80,
          cellRenderer: () => {
            return `<mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">
            delete</mat-icon>`;
          }
        },
      ]
    },
    {
      headerName: 'Doctor Details',
      children: [
        {
          headerName: 'Name',
          field: 'name',
          tooltipField: 'name',
          valueFormatter: this.stringFormatter,
          width: 150,

        },
        {
          headerName: 'Contact',
          field: 'phoneNumber',
          tooltipField: 'phoneNumber',
          width: 140
        },
        {
          headerName: 'Email',
          field: 'email',
          tooltipField: 'email',
          width: 250
        },
        {
          headerName: 'Address',
          field: 'address.address',
          tooltipField: 'address.address',
          valueFormatter: this.stringFormatter,
          width: 200
        },
        {
          headerName: 'Pincode',
          field: 'address.pincode',
          tooltipField: 'address.pincode',
          width: 100
        },
        {
          headerName: 'City',
          field: 'address.city',
          tooltipField: 'address.city',
          valueFormatter: this.stringFormatter,
          width: 100
        },
        {
          headerName: 'State',
          field: 'address.state',
          tooltipField: 'address.state',
          valueFormatter: this.stringFormatter,
          width: 100
        },
        {
          headerName: 'Country',
          field: 'address.country',
          tooltipField: 'address.country',
          valueFormatter: this.stringFormatter,
          width: 100
        }
      ]
    }
  ];

  constructor(
    private dialog: MatDialog,
    private displayService: DisplayService,
    private doctorService: DoctorService) {
    this.gridOptions = <GridOptions>{};
    this.gridOptions = <GridOptions>{
      headerHeight: window.innerWidth <= 1024 ? 88 : 30,
    };
    this.doctors = [
      {'isActive':true, 'isBlocked':false, 'name':'sushi', 'phoneNumber':'1234567890','email':'abc@xyz.com',
    "address":{
      "address":"street1",
      "city":"Mumbai",
      "state":"Maharashtra",
      "country":"india",
      "pincode":"12345"

    }},
      {'isActive':true, 'isBlocked':false, 'name':'sushi', 'phoneNumber':'1234567890','email':'abc@xyz.com'}
    ]
  }

  
  ngOnInit(): void {
    this.rowCount = this.doctors!.length;
  }

  ngOnDestroy() {
    this.subscriptions?.unsubscribe();
  }

  
  openConfirmationModal(event: any){
    if(event.value){
      this.deleteModalData = {
        title : 'Block User',
        msg : 'Do you want to Block the User?',
        icon: 'block',
        confirmButtonText: 'Block',
        cancelButtonText: 'Cancel',
        type: 'blockUser',
        errorMsg: '',
        successMsg: ''
      }
    }else{
      this.deleteModalData = {
        title : 'UnBlock User',
        msg : 'Do you want to UnBlock the User?',
        icon: 'lock_open',
        confirmButtonText: 'UnBlock',
        cancelButtonText: 'Cancel',
        type: 'blockUser',
        errorMsg: '',
        successMsg: ''
      }
    }
    let deleteModalData = {
      modalMsg : this.deleteModalData,
      details : '',
      component: this.component
    }
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      data: deleteModalData,
      width: '375px'
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if(result.result){
        let payload = {
          isBlocked: event.value
        }
        // this.blockUser(event.data._id, payload);
      }
    });
  }
  
  stringFormatter(params: any) {
    var cellData = params.value;
    var firstChar = cellData?.slice(0, 1).toUpperCase();
    return firstChar + cellData?.slice(1);
  }
}
