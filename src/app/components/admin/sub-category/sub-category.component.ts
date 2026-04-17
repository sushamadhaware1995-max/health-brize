import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { ImageRendererComponent } from 'src/app/shared/components/image-renderer/image-renderer.component';
import { TagRendererComponent } from 'src/app/shared/components/tag-renderer/tag-renderer.component';
import { ActionMsg } from 'src/app/shared/models/actionMsg';
import { DeleteModalObj } from 'src/app/shared/models/deleteModalObj';
import { DisplayService } from 'src/app/shared/services/display.service';
import { CategoryService } from '../category/category.service';
import { SubCategoryService } from './sub-category.service';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent implements OnInit {

  subCategories: any[] | undefined;
  //ag-grid variables
  gridOptions: GridOptions = <GridOptions>{};
  @Output() selectedItemID = new EventEmitter<any>();
  columnDefs: any[] = [
    {
      headerName: 'Actions',
      children: [
        {
          headerName: 'View',
          field: 'subCategoryView',
          width: 80,
          cellRenderer: () => {
            return `<mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">
            visibility</mat-icon>`;
          },
        },
        {
          headerName: 'Edit',
          field: 'subCategoryEdit',
          width: 80,
          cellRenderer: () => {
            return `<mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">
            edit</mat-icon>`;
          },
        },
        {
          headerName: 'Delete',
          field: 'subCategoryDelete',
          width: 80,
          cellRenderer: () => {
            return `<mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">
            delete</mat-icon>`;
          },
        }
      ]
    },
    {
      headerName: 'Sub-Category Details',
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
          headerName: 'Is Listed',
          field: 'isListed',
          tooltipField: 'isListed',
          width: 150,
        },
        {
          headerName: 'Category',
          field: 'category',
          tooltipField: 'category',
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
          width: 200,
        },
        // {
        //   headerName: 'Purities',
        //   field: 'purities',
        //   cellRenderer: TagRendererComponent,
        //   cellRendererParams: {
        //     type: 'Category',
        //     clicked: function (field: any) {
        //       // alert(`${field} was clicked`);
        //     },
        //   },
        //   width: 150,
        //   tooltipField: 'purities',
        // }
      ]
    }
  ];

  rowData: any[] = [];
  rowCount: number = 0;
  fileName: string = 'SubCategories.csv';
  addUserBtnText: string = 'Add SubCategory';
  component: string = 'SubCategoryComponent';
  deleteModalObj: DeleteModalObj = {
    title: 'Delete SubCategory',
    msg: 'Do you want to delete SubCategory? This process cannot be undone',
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
  columnKeys: string[] = ['iconImage','name', 'description', 'category', 'isListed'];
  isLoading: boolean = false;

  constructor(
    private subCategoryService: SubCategoryService,
    private displayService: DisplayService
    ) {
    this.gridOptions = <GridOptions>{};
    this.gridOptions = <GridOptions>{
      headerHeight: window.innerWidth <= 1024 ? 88 : 30,
    };
  }

  ngOnInit(): void {
    this.getSubCategories();
  }

  getSubCategories() {
    this.isLoading = true;
    this.subCategoryService.getSubCategories().subscribe((res: any) => {
      if (res.data) {
        this.subCategories = res.data.map((subCategory: any) => {
          return {
            id: subCategory._id,
            name: subCategory.name,
            description: subCategory.description,
            category: subCategory?.categoryId?.name,
            categoryId: subCategory?.categoryId?._id,
            isListed: subCategory.isListed,
            iconImage: subCategory.iconImage
          }
        });
        this.rowCount = this.subCategories!.length;
        this.isLoading = false;
      }
    });
  }

  deleteSubCategory(subCategoryId: string) {
    this.isLoading = true;
    this.subCategoryService.deleteSubCategory(subCategoryId).subscribe((response: any) => {
      if (response && response.status === "success") {
        this.isLoading = false;
        this.getSubCategories();
        this.displayService.openSnackBar('SubCategory deleted successfully', '', 2000, 'top', 'right', 'success');
      }
    }, (error: any) => {
      this.isLoading = false;
      this.displayService.openSnackBar('Something went wrong!', '', 2000, 'top', 'right', 'error');
    });
  }

  getActionConfirmation(event: any) {
    if (event && !event.hasOwnProperty('result')) {
      this.getSubCategories();
    } else if (event?.result) {
      this.deleteSubCategory(event.data.id);
    }
  }

}
