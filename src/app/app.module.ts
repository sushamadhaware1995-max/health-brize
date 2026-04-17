import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/modules/shared/shared.module';
import { MaterialModule } from './shared/modules/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DeleteModalComponent } from './shared/components/delete-modal/delete-modal.component';
import { CategoryComponent } from './components/admin/category/category.component';
import { DropdownRendererComponent } from './shared/components/dropdown-renderer/dropdown-renderer.component';


@NgModule({
  declarations: [
    AppComponent,
    DeleteModalComponent,
    DropdownRendererComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    CommonModule,
    MaterialModule,
    HttpClientModule
  ],
  exports: [
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
