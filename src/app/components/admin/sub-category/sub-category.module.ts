import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubCategoryRoutingModule } from './sub-category-routing.module';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';
import { SharedModule } from 'src/app/shared/modules/shared/shared.module';
import { SubCategoryComponent } from './sub-category.component';
import { AddEditSubCategoryComponent } from './add-edit-sub-category/add-edit-sub-category.component';



@NgModule({
  declarations: [SubCategoryComponent, AddEditSubCategoryComponent],
  imports: [
    SubCategoryRoutingModule,
    CommonModule,
    MaterialModule,
    SharedModule,
  ],
  exports: [
    SubCategoryComponent
  ]
})
export class SubCategoryModule { }
