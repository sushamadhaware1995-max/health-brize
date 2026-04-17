import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared/shared.module';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { UserService } from './user.service';

@NgModule({
  declarations: [
    UserComponent,
    AddEditUserComponent
  ],
  exports: [
    UserComponent,
    AddEditUserComponent,
    ReactiveFormsModule
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [
    UserService
  ]
})
export class UserModule { }
