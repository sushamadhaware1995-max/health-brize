import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteModalObj } from '../../models/deleteModalObj';
import { DisplayService } from '../../services/display.service';

@Component({
  selector: 'admin-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.scss']
})
export class TopNavigationComponent implements OnInit {

  componentName : string ='TopNavigationComponent';
  adminProfile: any;
  isLoading: boolean = false;
  deleteModalData: DeleteModalObj = {
    title : 'Logout',
    msg : 'Do you want to logout?',
    icon: 'logout',
    confirmButtonText: 'Logout',
    cancelButtonText: 'Cancel',
    errorMsg: '',
    successMsg: ''
  }

  constructor(private authenticationService : AuthenticationService, 
    public dialog: MatDialog,
    private displayService: DisplayService) { }

  ngOnInit(): void {
    this.getUserProfile();
  }

  getUserProfile(){
    this.authenticationService.getUserProfile().subscribe((data: any)=> {
      this.adminProfile = data;
    }, error => {
      this.displayService.openSnackBar(error.error.message, '', 3000, 'top', 'right', 'success');
    });
  }

  async logout(){
    let deleteModalData = {
      modalMsg : this.deleteModalData,
      details : '',
      component: this.componentName
    }
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      data: deleteModalData,
      width: '25vw'
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.result){
        this.authenticationService.logout();
      }
    });
  }
}
