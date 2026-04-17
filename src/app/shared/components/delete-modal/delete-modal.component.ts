import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AddEditUserComponent } from 'src/app/components/admin/admin/user/add-edit-user/add-edit-user.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { DisplayService } from '../../services/display.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/components/admin/user/user.service';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {
  componentName: string = '';
  deleteBtnText : string = 'Delete';
  deleteBtnIcon : string = 'delete';
  cancelBtnText: string = 'Cancel';
  sendDeleteConfirmation: any = {
    result: false,
    type: ''
  }
  constructor( public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private userService: UserService,
    private displayService: DisplayService,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.componentName = this.data.component;
    if(this.componentName === 'TopNavigationComponent'){
      this.deleteBtnText = 'Logout';
      this.deleteBtnIcon = 'logout';
    }
  }

  // confirm(): void{
  //   if(this.componentName === 'UserComponent'){
  //     this.userService.deleteUser(this.data.details._id).subscribe((res:any) => {
  //       if(res.data){
  //         this.sendDeleteConfirmation.result = true;
  //         this.sendDeleteConfirmation.type = "delete";
  //         this.displayService.openSnackBar(this.data.modalMsg.successMsg, '', 2000, 'top', 'right', 'success');
  //       }
  //       else{
  //         this.sendDeleteConfirmation.result = false;
  //         this.sendDeleteConfirmation.type = "delete";
  //         this.displayService.openSnackBar(this.data.modalMsg.errorMsg, '', 2000, 'top', 'right', 'error');
  //       }
  //       this.close(this.sendDeleteConfirmation);
  //     })
  //   }

  //   //category delete
  //   if(this.componentName === 'CategoryComponent'){
     
  //   }

  //   //user logout
  //   if(this.componentName === 'TopNavigationComponent'){
  //     this.authenticationService.logout();
  //     this.close();

      
  //   }
  // }
  
  close(result?: any, type?: string) {
    let confirmation = {
      result: result,
      type: type,
      data: this.data.details
    }
    this.dialogRef.close(confirmation);
  }
}
