import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/modules/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApproveUsersComponent } from './approve-users.component';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';
import { ApproveUserRoutingModule } from './approve-users-routing.module';



@NgModule({
  declarations: [ApproveUsersComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ApproveUserRoutingModule
  ]
})
export class ApproveUsersModule { }
