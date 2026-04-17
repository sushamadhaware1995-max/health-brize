import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { DeleteModalComponent } from 'src/app/shared/components/delete-modal/delete-modal.component';
import { DropdownRendererComponent } from 'src/app/shared/components/dropdown-renderer/dropdown-renderer.component';
import { ImageRendererComponent } from 'src/app/shared/components/image-renderer/image-renderer.component';
import { TagRendererComponent } from 'src/app/shared/components/tag-renderer/tag-renderer.component';
import { DeleteModalObj } from 'src/app/shared/models/deleteModalObj';
import { DisplayService } from 'src/app/shared/services/display.service';
import { OrdersService } from './orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  orderStatus: string[] = [
    'Booked', 'Delivered', 'Cancelled', 'Other'
  ];
  columnDefs: any[] = [
    {
      headerName: 'Actions',
      children: [
        {
          headerName: 'View',
          field: 'viewOrder',
          width: 80,
          cellRenderer: () => {
            return `<mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">
            visibility</mat-icon>`;
          }
        },
        {
          headerName: 'Update Status',
          field: 'status',
          cellRenderer: DropdownRendererComponent,
          cellRendererParams: {
            type: 'Order',
            change: this.openConfirmationModal.bind(this)
          },
          tooltipField: 'status',
          width: 150,
        },
      ]
    },
    {
      headerName: 'Order Details',
      children: [
        {
          headerName: 'Current Status',
          field: 'status',
          cellRenderer: TagRendererComponent,
          cellRendererParams: {
            type: 'Order',
            clicked: function (field: any) {
              alert(`${field} was clicked`);
            }
          },
          tooltipField: 'status',
          width: 150,
        },
        {
          headerName: 'Quantity',
          field: 'quantity',
          tooltipField: 'quantity',
          width: 100,
        }
      ]
    },
    {
      headerName: 'User Details',
      children: [
        {
          headerName: 'Name',
          field: 'name',
          tooltipField: 'name',
          width: 150,
        },
        {
          headerName: 'Phone Number',
          field: 'phoneNumber',
          tooltipField: 'phoneNumber',
          width: 130
        },
        {
          headerName: 'Email',
          field: 'email',
          tooltipField: 'email',
          width: 200
        },
        {
          headerName: 'Address',
          field: 'address',
          tooltipField: 'address',
          width: 250
        },
        {
          headerName: 'Pincode',
          field: 'pincode',
          tooltipField: 'pincode',
          width: 100
        },
        {
          headerName: 'City',
          field: 'city',
          tooltipField: 'city',
          width: 150
        },
        {
          headerName: 'State',
          field: 'state',
          tooltipField: 'state',
          width: 150
        },
        {
          headerName: 'Country',
          field: 'country',
          tooltipField: 'country',
          width: 150
        },
      ]
    },
    {
      headerName: 'Product Details',
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
          headerName: 'Product Code',
          field: 'productCode',
          tooltipField: 'productCode',
          width: 150
        },
        {
          headerName: 'Name',
          field: 'productName',
          tooltipField: 'productName',
          width: 200
        },
        {
          headerName: 'Category',
          field: 'category',
          tooltipField: 'category',
          width: 200
        },
        {
          headerName: 'SubCategory',
          field: 'subCategory',
          tooltipField: 'subCategory',
          width: 200
        },
        {
          headerName: 'Purity',
          field: 'purity',
          width: 150,
          tooltipField: 'purity'
        }
      ]
    }
  ]
  gridOptions: GridOptions = <GridOptions>{};
  rowData: any[] = [];
  rowCount: number = 0;
  fileName: string = 'Orders.csv';
  columnKeys: string[] = ["id", "status", "quantity", "productName", "category", "purity", "name", "phoneNumber", "email", "address", "pincode",
    "city", "state", "country",];
  component: string = 'OrdersComponent';
  isLoading: boolean = false;
  orders: any[] = [];
  deleteModalData: DeleteModalObj = {
    title: 'Update Order Status',
    msg: 'Do you want to update the order status?',
    icon: 'verified',
    confirmButtonText: 'Update',
    cancelButtonText: 'Cancel',
    errorMsg: 'Error updating order status',
    successMsg: 'Successfully Updated order status'
  }

  constructor(private ordersService: OrdersService,
    private displayService: DisplayService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.isLoading = true;
    this.ordersService.getOrders().subscribe(response => {
      if (response && response.data) {
        this.orders = response.data.map((order: any) => {
          return {
            id: order._id,
            status: order.status,
            quantity: order.quantity,
            name: order.userId?.name,
            phoneNumber: order.userId?.phoneNumber,
            email: order.userId?.email,
            address: order.userId?.address?.address,
            pincode: order.userId?.address?.pincode,
            city: order.userId?.address?.city,
            state: order.userId?.address?.state,
            country: order.userId?.address?.country,
            productName: order.productId?.name,
            category: order.productId?.subCategoryId.categoryId?.name,
            subCategory: order.productId?.subCategoryId?.name,
            purity: order.productId?.purity,
            iconImage: order.productId?.iconImage,
            productCode: order.productId?.code
          }
        });
        this.rowCount = this.orders!.length;
        this.isLoading = false;
      }
    }, error => {
      this.isLoading = false;
      this.displayService.openSnackBar("Something went wrong! Please try again.", '', 3000, 'top', 'right', 'error');
    });
  }

  updateOrderStatus(orderId: string, currentStatus: string) {
    this.isLoading = true;
    let payload = {
      status: currentStatus
    }
    this.ordersService.updateOrderStatus(orderId, payload).subscribe(response => {
      if (response) {
        this.getOrders();
        this.displayService.openSnackBar("Order status updated successfully.", '', 3000, 'top', 'right', 'success');
        this.isLoading = false;
      }
    }, error => {
      this.isLoading = false;
      this.displayService.openSnackBar("Something went wrong! Please try again.", '', 3000, 'top', 'right', 'error');
    })
  }

  openConfirmationModal(event: any) {
    let confirmatioData = {
      modalMsg: this.deleteModalData,
      details: '',
      component: 'OrdersComponent'
    }
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      data: confirmatioData,
      width: '375px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.result) {
        this.updateOrderStatus(event.data.id, event.value);
      }
    });
  }

  getActionConfirmation(event: any) {
    if (event && !event.hasOwnProperty('result')) {
      this.getOrders();
    }
  }
}
