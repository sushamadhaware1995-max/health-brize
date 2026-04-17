import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/modules/shared/shared.module';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';
import { DoctorComponent } from './doctor.component';
import { AddEditDoctorComponent } from './add-edit-doctor/add-edit-doctor.component';
import { DoctorRoutingModule } from './doctor-routing.module';
import { DoctorService } from './doctor.service';

@NgModule({
  declarations: [
    DoctorComponent,
    AddEditDoctorComponent
  ],
  exports: [
    DoctorComponent,
    AddEditDoctorComponent,
    ReactiveFormsModule
  ],
  imports: [
    CommonModule,
    DoctorRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [
    DoctorService
  ]
})
export class DoctorModule { }
