import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { BtnRendererComponent } from 'src/app/shared/components/btn-renderer/btn-renderer.component';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { DeleteModalObj } from 'src/app/shared/models/deleteModalObj';
import { DisplayService } from 'src/app/shared/services/display.service';
import { UserService } from '../user/user.service';
import { ApproveUsersService } from './approve-users.service';

@Component({
  selector: 'app-approve-users',
  templateUrl: './approve-users.component.html',
  styleUrls: ['./approve-users.component.scss']
})
export class ApproveUsersComponent implements OnInit {

  isLoading: boolean = false;
  gridOptions: GridOptions = <GridOptions>{};
  subscriptions: Subscription | undefined;
  columnDefs = [
    {
      headerName: 'Actions',
      children: [
        {
          headerName: 'Approve',
          field: 'isVerified',
          cellRenderer: BtnRendererComponent,
          cellRendererParams: {
            clicked:
              this.openConfirmationModal.bind(this)
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
        }
      ]
    },
    {
      headerName: 'User Details',
      children: [
        {
          headerName: 'Name',
          field: 'name',
          tooltipField: 'name',
          width: 120,
    
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
          width: 150
        },
        {
          headerName: 'Address',
          field: 'address.address',
          tooltipField: 'address.address',
          width: 150
        },
        {
          headerName: 'Pincode',
          field: 'address.pincode',
          tooltipField: 'address.pincode',
          width: 120
        },
        {
          headerName: 'City',
          field: 'address.city',
          tooltipField: 'address.city',
          width: 130
        },
        {
          headerName: 'State',
          field: 'address.state',
          tooltipField: 'address.state',
          width: 130
        },
        {
          headerName: 'Country',
          field: 'address.country',
          tooltipField: 'address.country',
          width: 100
        }
      ]
    }
  ];

  deleteModalData: DeleteModalObj = {
    title : 'Approve User',
    msg : 'Do you want to Approve the User?',
    icon: 'verified',
    confirmButtonText: 'Approve',
    cancelButtonText: 'Cancel',
    errorMsg: '',
    successMsg: ''
  }

  users: any[] | undefined;
  rowCount: number = 0;
  
  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private displayService: DisplayService,
    private approveUsersService: ApproveUsersService) { 
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.isLoading = true;
    this.subscriptions = this.userService.getUsers().subscribe((response: any) => {
      if (response.data) {
        const userList = response.data;
        this.users = userList.filter((user: any) => {
          return user.role === 'user' || user.role === 'employee' && user.isActive;
        });
        this.rowCount = this.users!.length;
        this.isLoading = false;
      }
    }, error => {
      this.isLoading = false;
      this.displayService.openSnackBar(error.error.message, '', 3000, 'top', 'right', 'danger');
    });
  }

  openConfirmationModal(event: any){
    let deleteModalData = {
      modalMsg : this.deleteModalData,
      details : '',
      component: 'ApproveUsersComponent'
    }
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      data: deleteModalData,
      width: '375px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.result){
        let payload = {
          isVerified: result.result
        }
        this.approveUser(event.data._id, payload);
      }
    });
  }

  approveUser(id: string, payload: any){
    this.isLoading = true;
    this.approveUsersService.approveUser(id, payload).subscribe(response => {
      if(response && response.status === 'success'){
        this.displayService.openSnackBar('User Approval Successful', '', 3000, 'top', 'right', 'success');
        this.getUsers();
        this.isLoading = false;
      }
    }, error => {
      this.isLoading = false;
      this.displayService.openSnackBar(error.error.message, '', 3000, 'top', 'right', 'danger');
    });
  }

  getActionConfirmation(event: any) {
    if (event && !event.hasOwnProperty('result')) {
      this.getUsers();
    }
  }
}

