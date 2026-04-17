import { CategoryComponent } from "./category.component";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/modules/shared/shared.module';
import { CategoryRoutingModule } from "./category-routing.module";
import { MaterialModule } from "src/app/shared/modules/material/material.module";
import { AddEditCategoryComponent } from './add-edit-category/add-edit-category.component';

@NgModule({
    declarations: [
        CategoryComponent,
        AddEditCategoryComponent
    ],
    imports: [
      CommonModule,
      CategoryRoutingModule,
      SharedModule,
      FormsModule,
      ReactiveFormsModule,
      MaterialModule
    ],
    exports: [
        CategoryComponent
    ],
  })
  export class CategoryModule { }