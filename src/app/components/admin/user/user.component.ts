import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';

import { GridOptions } from 'ag-grid-community';
import { BtnRendererComponent } from 'src/app/shared/components/btn-renderer/btn-renderer.component';
import { DeleteModalObj } from 'src/app/shared/models/deleteModalObj';
import { ActionMsg } from 'src/app/shared/models/actionMsg';
import { UserService } from './user.service';
import { Subscription } from 'rxjs';
import { DisplayService } from 'src/app/shared/services/display.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  gridOptions: GridOptions = <GridOptions>{};
  @Output() selectedItemID = new EventEmitter<any>();
  subscriptions: Subscription | undefined;
  deleteModalObj: DeleteModalObj = {
    title: 'Delete User',
    msg: 'Do you really want to delete this user? This process cannot be undone.',
    icon: 'delete',
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    errorMsg: 'Error occurred while deleting user',
    successMsg: 'User deleted successfully'
  }
  addActionMsg: ActionMsg = {
    errorMsg: 'Error occurred while adding new user',
    successMsg: 'User added successfully, Please approve the user in Approve Users Section.'
  }

  updateActionMsg: ActionMsg = {
    errorMsg: 'Error occurred while updating user',
    successMsg: 'User details updated successfully'
  }
  users: any[] | undefined;
  isLoading: boolean = false;
  upgradeGrid: boolean = true;
  rowCount: number = 0;
  fileName: string = 'Users.csv';
  addBtnIcon: string = 'person_add';
  addUserBtnText: string = 'Add User';
  component: string = 'UserComponent';
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
          field: 'userView',
          width: 80,
          cellRenderer: () => {
            return `<mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">
            visibility</mat-icon>`;
          }
        },
        {
          headerName: 'Edit',
          field: 'userEdit',
          width: 80,
          cellRenderer: () => {
            return `<mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">
            edit</mat-icon>`;
          }
        },
        {
          headerName: 'Delete',
          field: 'userDelete',
          width: 80,
          cellRenderer: () => {
            return `<mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">
            delete</mat-icon>`;
          }
        },
      ]
    },
    {
      headerName: 'User Details',
      children: [
        {
          headerName: 'Role',
          field: 'role',
          tooltipField: 'role',
          valueFormatter: this.stringFormatter,
          width: 150,

        },
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
    private userService: UserService) {
    this.gridOptions = <GridOptions>{};
    this.gridOptions = <GridOptions>{
      headerHeight: window.innerWidth <= 1024 ? 88 : 30,
    };
  }

  ngOnInit(): void {
    this.getUsers();
  }

  ngOnDestroy() {
    this.subscriptions?.unsubscribe();
  }

  stringFormatter(params: any) {
    var cellData = params.value;
    var firstChar = cellData?.slice(0, 1).toUpperCase();
    return firstChar + cellData?.slice(1);
  }

  getUsers() {
    this.isLoading = true;
    this.subscriptions = this.userService.getUsers().subscribe((response: any) => {
      if (response.data) {
        const userList = response.data;
        this.users = userList.filter((user: any) => {
          return user.role !== 'admin' && user.isVerified;
        });
        this.users?.forEach((user: any) => {
          user.isActive = user.isActive ? 'Active' : 'Inactive';
        });
        this.rowCount = this.users!.length;
        this.isLoading = false;
      }
    }, (error: any) => {
      this.isLoading = false;
      this.displayService.openSnackBar('Something went wrong!', '', 2000, 'top', 'right', 'error');
    });
  }

  deleteUser(userId: string) {
    this.isLoading = true;
    this.userService.deleteUser(userId).subscribe((response: any) => {
      if (response && response.status === "success") {
        this.isLoading = false;
        this.getUsers();
        this.displayService.openSnackBar('User deleted successfully', '', 2000, 'top', 'right', 'success');
      }
    }, (error: any) => {
      this.isLoading = false;
      this.displayService.openSnackBar('Something went wrong!', '', 2000, 'top', 'right', 'error');
    });
  }

  btnClickedHandler(event: any) {
    console.log("btnClickedHandler:", event)
  }

  editUser(data: any) {
    console.log("editUser", data)
  }

  getActionConfirmation(event: any) {
    if (event && !event.hasOwnProperty('result')) {
      this.getUsers();
    } else if (event.result) {
      this.deleteUser(event.data._id);
    }
  }

  blockUser(userId: string, payload: any){
    this.isLoading = true;
    let message: string;
    message = payload.isBlocked ? "User Blocked Successfully" : "User UnBlocked Successfully"
    this.userService.blockUser(payload, userId).subscribe(response => {
      if(response){
        this.getUsers();
        this.displayService.openSnackBar(message, '', 2000, 'top', 'right', 'success');
      }
    }, error => {
      this.displayService.openSnackBar('Something went wrong!', '', 2000, 'top', 'right', 'error');
    });
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
    dialogRef.afterClosed().subscribe(result => {
      if(result.result){
        let payload = {
          isBlocked: event.value
        }
        this.blockUser(event.data._id, payload);
      }
    });
  }
}
