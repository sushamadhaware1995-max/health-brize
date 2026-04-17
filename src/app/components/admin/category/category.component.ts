import { Component, OnInit, Output, EventEmitter } from '@angular/core';
// import { CategoryService } from './category.service';
import { GridOptions } from 'ag-grid-community';
import { DeleteModalObj } from 'src/app/shared/models/deleteModalObj';
import { ActionMsg } from 'src/app/shared/models/actionMsg';
import { TagRendererComponent } from 'src/app/shared/components/tag-renderer/tag-renderer.component';
import { CategoryService } from './category.service';
import { ImageRendererComponent } from 'src/app/shared/components/image-renderer/image-renderer.component';
import { DisplayService } from 'src/app/shared/services/display.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  categories: any[] | undefined;
  //ag-grid variables
  gridOptions: GridOptions = <GridOptions>{};
  @Output() selectedItemID = new EventEmitter<any>();
  columnDefs: any[] = [
    {
      headerName: 'Actions',
      children: [
        {
          headerName: 'View',
          field: 'categoryView',
          width: 80,
          cellRenderer: () => {
            return `<mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">
            visibility</mat-icon>`;
          },
        },
        {
          headerName: 'Edit',
          field: 'categoryEdit',
          width: 80,
          cellRenderer: () => {
            return `<mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">
            edit</mat-icon>`;
          },
        },
        {
          headerName: 'Delete',
          field: 'categoryDelete',
          width: 80,
          cellRenderer: () => {
            return `<mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">
            delete</mat-icon>`;
          },
        }
      ]
    },
    {
      headerName: 'Category Details',
      children: [
        {
          headerName: 'Image',
          field: 'iconImage',
          cellRenderer: ImageRendererComponent,
          cellRendererParams: {
            type: 'Category',
            clicked: function (field: any) {
              alert(`${field} was clicked`);
            },
          },
          tooltipField: 'iconImage',
          width: 150,
        },
        {
          headerName: 'Name',
          field: 'name',
          tooltipField: 'name',
          width: 150,
        },
        {
          headerName: 'Description',
          field: 'description',
          tooltipField: 'description',
          width: 250,
        },
        {
          headerName: 'Purities',
          field: 'purities',
          cellRenderer: TagRendererComponent,
          cellRendererParams: {
            type: 'Category',
            clicked: function (field: any) {
              // alert(`${field} was clicked`);
            },
          },
          width: 200,
          tooltipField: 'purities',
        }
      ]
    }
  ];

  rowData: any[] = [];
  rowCount: number = 0;
  fileName: string = 'Categories.csv';
  addUserBtnText: string = 'Add category';
  component: string = 'CategoryComponent';
  deleteModalObj: DeleteModalObj = {
    title: 'Delete Category',
    msg: 'Do you want to delete category? This process cannot be undone',
    icon: 'delete',
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    errorMsg: 'Error occurred while deleting category',
    successMsg: 'Category deleted successfully',
  };
  addActionMsg: ActionMsg = {
    errorMsg: 'Error occurred while adding new category',
    successMsg: 'Category added successfully',
  };

  updateActionMsg: ActionMsg = {
    errorMsg: 'Error occurred while updating category',
    successMsg: 'Category details updated successfully',
  };

  addBtnIcon: string = 'category';
  upgradeGrid: boolean = true;
  columnKeys: string[] = ['iconImage','name', 'description', 'purities'];
  isLoading: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private displayService: DisplayService
    ) {
    this.gridOptions = <GridOptions>{};
    this.gridOptions = <GridOptions>{
      headerHeight: window.innerWidth <= 1024 ? 88 : 30,
    };
  }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe((res: any) => {
      if (res.data) {
        this.categories = res.data;
        this.rowCount = this.categories!.length;
        this.isLoading = false;
      }
    });
  }

  deleteCategory(categoryId: string) {
    this.isLoading = true;
    this.categoryService.deleteCategory(categoryId).subscribe((response: any) => {
      if (response && response.status === "success") {
        this.isLoading = false;
        this.getCategories();
        this.displayService.openSnackBar('Category deleted successfully', '', 2000, 'top', 'right', 'success');
      }
    }, (error: any) => {
      this.isLoading = false;
      this.displayService.openSnackBar('Something went wrong!', '', 2000, 'top', 'right', 'error');
    });
  }

  getActionConfirmation(event: any) {
    if (event && !event.hasOwnProperty('result')) {
      this.getCategories();
    } else if (event?.result) {
      this.deleteCategory(event.data._id);
    }
  }
}
