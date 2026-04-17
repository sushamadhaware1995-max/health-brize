import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { ImageRendererComponent } from 'src/app/shared/components/image-renderer/image-renderer.component';
import { TagRendererComponent } from 'src/app/shared/components/tag-renderer/tag-renderer.component';
import { CategoryData } from 'src/app/shared/models/category';
import { DeleteModalObj } from 'src/app/shared/models/deleteModalObj';
import { DisplayService } from 'src/app/shared/services/display.service';
import { CategoryService } from '../category/category.service';
import { ProductsService } from './products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  columnDefs: any[] = [
    {
      headerName: 'View',
      field: 'productView',
      width: 80,
      cellRenderer: () => {
        return `<mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">
        visibility</mat-icon>`;
      }
    },
    {
      headerName: 'Edit',
      field: 'productEdit',
      width: 80,
      cellRenderer: () => {
        return `<mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">
        edit</mat-icon>`;
      }
    },
    {
      headerName: 'Delete',
      field: 'productDelete',
      width: 80,
      cellRenderer: () => {
        return `<mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">
        delete</mat-icon>`;
      }
    },
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
      width: 100,
    },
    {
      headerName: 'Is Listed',
      field: 'isListed',
      tooltipField: 'isListed',
      width: 120
    },
    {
      headerName: 'Product Code',
      field: 'productCode',
      tooltipField: 'productCode',
      width: 120
    },
    {
      headerName: 'Name',
      field: 'name',
      valueFormatter: this.stringFormatter,
      tooltipField: 'name',
      width: 150,

    },
    {
      headerName: 'Description',
      field: 'description',
      valueFormatter: this.stringFormatter,
      tooltipField: 'description',
      width: 200
    },
    {
      headerName: 'Weight',
      field: 'weight',
      tooltipField: 'weight',
      width: 100
    },
    {
      headerName: 'Stock',
      field: 'quantity',
      tooltipField: 'quantity',
      width: 80
    },
    {
      headerName: 'Category',
      field: 'category',
      valueFormatter: this.stringFormatter,
      tooltipField: 'category',
      width: 120
    },
    {
      headerName: 'SubCategory',
      field: 'subCategoryName',
      valueFormatter: this.stringFormatter,
      tooltipField: 'subCategoryName',
      width: 120
    },
    {
      headerName: 'Purity',
      field: 'purity',
      // cellRenderer: TagRendererComponent,
      // cellRendererParams: {
      //   type: 'Products',
      //   clicked: function (field: any) {
      //     // alert(`${field} was clicked`);
      //   },
      // },
      width: 150,
      tooltipField: 'purity',
    }
  ];
  columnKeys: string[] = ["productCode","name", "description", "productCode", "weight",
    "quantity", "category", "purities"];
  gridOptions: GridOptions = <GridOptions>{
    rowClassRules: {
      "row-fail": params => params.api.getValue("quantity", params.node) === 0,
      "row-pass": params => params.api.getValue("quantity", params.node) > 0
    },
  };
  deleteModalObj: DeleteModalObj = {
    title: 'Delete Product',
    msg: 'Do you really want to delete this Product? This process cannot be undone.',
    icon: 'delete',
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    errorMsg: 'Error occurred while deleting user',
    successMsg: 'User deleted successfully'
  }
  products: any[] = [];
  categories: CategoryData[] | undefined;
  rowData: any[] = [];
  rowCount: number = 0;
  fileName: string = 'Products.csv';
  addBtnIcon: string = 'inventory';
  addUserBtnText: string = 'Add Product';
  component: string = 'ProductsComponent';
  isLoading: boolean = false;

  constructor(private productService: ProductsService,
    private displayService: DisplayService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  stringFormatter(params: any) {
    var cellData = params.value;
    var firstChar = cellData?.slice(0, 1).toUpperCase();
    return firstChar + cellData?.slice(1);
  }

  getProducts(){
    this.isLoading = true;
    this.productService.getProducts().subscribe(response => {
      if(response){
        this.products = response.data.map((product: any) => {
          return {
            id: product?._id,
            name: product?.name,
            description: product?.description ? product?.description : '',
            iconImage: product?.iconImage,
            quantity: product?.availableQuantity,
            purity: product?.purity,
            weight: (product?.weight?.value !== undefined ? product?.weight?.value : '') + ' ' + (product?.weight?.unitName !== undefined ? product?.weight?.unitName : ''),
            category: product?.subCategoryId?.categoryId !== null ? product?.subCategoryId?.categoryId?.name : '',
            categoryId: product?.subCategoryId?.categoryId?._id,
            subCategoryId: product?.subCategoryId?._id,
            subCategoryName: product?.subCategoryId?.name,
            images: product?.images,
            productCode: product?.code,
            value: product?.weight?.value !== undefined ? product?.weight?.value : '',
            unitName: product?.weight?.unitName !== undefined ? product?.weight?.unitName : '',
            isListed: product.isListed
          }
        });
        this.rowCount = this.products!.length;
        this.isLoading = false;
      }
    }, error => {
      this.isLoading = false;
      this.displayService.openSnackBar("Something went wrong! Please try again.", '', 3000, 'top', 'right', 'error');
    });
  }

  deleteProduct(productId: string) {
    this.isLoading = true;
    this.productService.deleteProduct(productId).subscribe((response: any) => {
      if (response && response.status === "success") {
        this.isLoading = false;
        this.getProducts();
        this.displayService.openSnackBar('Product deleted successfully', '', 2000, 'top', 'right', 'success');
      }
    }, (error: any) => {
      this.isLoading = false;
      this.displayService.openSnackBar('Something went wrong!', '', 2000, 'top', 'right', 'error');
    });
  }

  getActionConfirmation(event: any) {
    if (event && !event.hasOwnProperty('result')) {
      this.getProducts();
    }else if (event?.result) {
      this.deleteProduct(event.data.id);
    }
  }
}
