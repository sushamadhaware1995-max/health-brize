import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';
import { SharedModule } from 'src/app/shared/modules/shared/shared.module';
import { ProductsComponent } from './products.component';
import { ProductsRoutingModule } from './products-routing.module';
import { AddEditProductComponent } from './add-edit-product/add-edit-product.component';



@NgModule({
  declarations: [ProductsComponent, AddEditProductComponent],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    ProductsRoutingModule
  ],
  exports: [
    ProductsComponent
  ],
})
export class ProductsModule { }
