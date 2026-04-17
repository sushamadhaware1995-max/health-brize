import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss']
})
export class ViewOrderComponent implements OnInit {

  data: any;
  form: FormGroup;
  title: string = '';
  currentAction: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ViewOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public modalData: any,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      status: [''],
      quantity: [''],
      name: [''],
      phone: [''],
      email: [''],
      address: [''],
      pincode: [''],
      city: [''],
      state: [''],
      country: [''],
      productName: [''],
      category: [''],
      purity: ['']
    });
    this.data = this.modalData.data;
    if(this.data){
      if(this.data.hasOwnProperty('id')){
        if(this.modalData.action === 'view'){
          this.currentAction = true;
          this.title = 'Order Detail';
          this.setFormValue(this.data);
          this.form.disable();
        }
      }
    }
  }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  setFormValue(data: any) {
    this.form.get('status')?.setValue(data.status);
    this.form.get('productName')?.setValue(data.productName);
    this.form.get('phone')?.setValue(data.phoneNumber);
    this.form.get('email')?.setValue(data.email);
    this.form.get('name')?.setValue(data.name);
    this.form.get('quantity')?.setValue(data.quantity);
    this.form.get('category')?.setValue(data.category);
    this.form.get('address')?.setValue(data.address);
    this.form.get('city')?.setValue(data.city);
    this.form.get('country')?.setValue(data.country);
    this.form.get('state')?.setValue(data.state);
    this.form.get('pincode')?.setValue(data.pincode);
  }
}
