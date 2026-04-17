import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/modules/shared/shared.module";
import { AdminComponent } from "./admin.component";
import { NgModule } from '@angular/core';
import { AdminRoutingModule } from "./admin-routing.module";
import { EmployeesComponent } from './employees/employees.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { AddEditSubCategoryComponent } from './sub-category/add-edit-sub-category/add-edit-sub-category.component';
// import { DoctorComponent } from './doctor/doctor.component';

@NgModule({
    declarations: [
      AdminComponent,
      EmployeesComponent,

    ],
    imports: [
      CommonModule,
      AdminRoutingModule,
      SharedModule
    ]
  })
  export class AdminModule { }
  