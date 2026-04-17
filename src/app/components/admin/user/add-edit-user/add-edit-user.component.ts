import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { AddUserData } from 'src/app/shared/models/addUser';
import { UserService } from '../user.service';
import { updateUserData } from 'src/app/shared/models/updateUser';
import { DisplayService } from 'src/app/shared/services/display.service';
import { Roles } from 'src/app/fakedata/role';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss'],
})
export class AddEditUserComponent implements OnInit {
  userForm: FormGroup;
  roles: any[] = Roles;
  isLoading: boolean = false;
  title: string = '';
  buttonText: string = '';
  isUpdate: boolean = false;
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  data: any;
  cancelButtonText: string = "Cancel";
  submitButtonText: string = "Add User"
  currentAction: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddEditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public modaldata: any,
    private fb: FormBuilder,
    private userService: UserService,
    private displayService: DisplayService
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      isActive: ['', Validators.required],
      isBlocked: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['India', Validators.required],
      state: ['', Validators.required],
      pincode: ['', Validators.required],
      role: ['user', Validators.required],
    });
    this.data = this.modaldata.data;
    if (this.data) {
      if (this.data.hasOwnProperty('_id')) {
        if (this.modaldata.action === 'viewOnly') {
          this.currentAction = true;
          this.userForm.disable();
          this.title = 'User Detail';
          this.cancelButtonText = "Close"
        } else {
          this.title = 'Update User Detail';
          this.submitButtonText = "Update User"
        }
        this.setFormValue(this.data);
        this.isUpdate = true;
      }
    } else {
      this.title = 'New User';
      this.isUpdate = false;
    }
  }

  ngOnInit(): void { }

  setFormValue(detailToUpdate: any) {
    this.userForm.get('name')?.setValue(detailToUpdate.name);
    this.userForm.get('phone')?.setValue(detailToUpdate.phoneNumber);
    this.userForm.get('email')?.setValue(detailToUpdate.email);
    this.userForm.get('dateOfBirth')?.setValue(detailToUpdate.dateOfBirth);
    this.userForm.get('isActive')?.setValue(detailToUpdate.isActive);
    this.userForm.get('isBlocked')?.setValue(detailToUpdate.isBlocked);
    this.userForm.get('role')?.setValue(detailToUpdate.role);
    if (detailToUpdate.address) {
      this.userForm.get('address')?.setValue(detailToUpdate.address.address);
      this.userForm.get('city')?.setValue(detailToUpdate.address.city);
      this.userForm.get('country')?.setValue(detailToUpdate.address.country);
      this.userForm.get('state')?.setValue(detailToUpdate.address.state);
      this.userForm.get('pincode')?.setValue(detailToUpdate.address.pincode);
    }
  }

  get f() {
    return this.userForm.controls;
  }

  closeDialog(isActionPerfomed?: boolean) {
    this.dialogRef.close(isActionPerfomed);
  }

  onSubmit(formData: any) {
    this.isLoading = true;
    if (this.isUpdate) {
      let updateUserObj: updateUserData = {
        name: formData?.name ? formData?.name : this.data?.name,
        email: formData?.email ? formData?.email : this.data?.email,
        role: formData?.role ? formData?.role : this.data?.role,
        dateOfBirth: formData?.dateOfBirth
          ? formData?.dateOfBirth
          : this.data?.dateOfBirth,
        address: {
          address: formData?.address
            ? formData?.address
            : this.data?.address?.address,
          city: formData?.city ? formData?.city : this.data?.address?.city,
          country: formData?.country
            ? formData?.country
            : this.data?.address?.country,
          pincode: formData?.pincode
            ? formData?.pincode
            : this.data?.address?.pincode,
          state: formData?.state ? formData?.state : this.data?.address?.state,
        },
      };
      this.userService
        .updateUserDetails(this.data._id, updateUserObj)
        .subscribe((response: any) => {
          if (response && response.data._id) {
            this.displayService.openSnackBar('User details updated successfully', '', 2000, 'top', 'right', 'success');
            this.userForm.reset();
            this.isLoading = false;
            this.closeDialog(true);
          }
        }, error => {
          this.isLoading = false;
          this.displayService.openSnackBar(error.error.message, '', 2000, 'top', 'right', 'error');
        });
    } else {
      let addUserObj: AddUserData = {
        name: formData.name,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        role: formData.role,
        phoneNumber: formData.phone,
        isBlocked: formData.isBlocked === '' ? false : true,
        address: {
          city: formData.city,
          state: formData.state,
          country: formData.country,
          pincode: formData.pincode,
          address: formData.address,
        },
      };
      this.userService.addUser(addUserObj).subscribe((response: any) => {
        if (response && response.data._id) {
          this.displayService.openSnackBar('User added successfully, Please approve the user in Approve Users Section.', '', 2000, 'top', 'right', 'success');
          this.isLoading = false;
          this.userForm.reset();
          this.closeDialog();
        }
      }, error => {
        this.isLoading = false;
        this.displayService.openSnackBar(error.error.message, '', 2000, 'top', 'right', 'error');
      });
    }
  }
}
