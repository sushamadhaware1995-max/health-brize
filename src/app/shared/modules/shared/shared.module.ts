import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableComponent } from '../../components/data-table/data-table.component';
import { MaterialModule } from '../material/material.module';
import { LinkRendererComponent } from '../../components/link-renderer/link-renderer.component';
import { ImageRendererComponent } from '../../components/image-renderer/image-renderer.component';
import { BtnRendererComponent } from '../../components/btn-renderer/btn-renderer.component';
import { SideNavigationComponent } from '../../components/side-navigation/side-navigation.component';
import { TagRendererComponent } from '../../components/tag-renderer/tag-renderer.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { TopNavigationComponent } from '../../components/top-navigation/top-navigation.component';

@NgModule({
    declarations: [
      DataTableComponent,
      LinkRendererComponent,
      ImageRendererComponent,
      BtnRendererComponent,
      SideNavigationComponent,
      TagRendererComponent,
      LoaderComponent,
      TopNavigationComponent
    ],
    imports: [
      CommonModule,
      AgGridModule.withComponents([
        LinkRendererComponent,
        ImageRendererComponent,
        BtnRendererComponent,
        TagRendererComponent
      ]),
      FormsModule,
      ReactiveFormsModule,
      MaterialModule
    ],
    exports: [
      DataTableComponent,
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      ReactiveFormsModule,
      LinkRendererComponent,
      ImageRendererComponent,
      BtnRendererComponent,
      SideNavigationComponent,
      TagRendererComponent,
      LoaderComponent,
      TopNavigationComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
  })
  export class SharedModule { }
  