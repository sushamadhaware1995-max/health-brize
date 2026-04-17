import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Units } from 'src/app/fakedata/units';
import { DisplayService } from 'src/app/shared/services/display.service';
import { AddEditCategoryComponent } from '../../category/add-edit-category/add-edit-category.component';
import { CategoryService } from '../../category/category.service';
import { SubCategoryService } from '../../sub-category/sub-category.service';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.scss']
})
export class AddEditProductComponent implements OnInit {

  productForm: FormGroup;
  
  cancelButtonText: string = 'Cancel';
  buttonText: string = '';
  title: string = '';
  productId: string = '';

  data: any;
  
  addedTags: any[] = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  isUpdate: boolean = false;
  currentAction: boolean = false;
  isLoading: boolean = false;
  msg: any = '';
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  categories: any[] = [];
  subCategories: any[] = [];
  purities: any[] = [];
  image: any;
  imagePreview: any;
  units: any[] = Units;
  imageFile: any;
  file: any;

  selectedCategoryId: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddEditCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public modaldata: any,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private productService: ProductsService,
    private displayService: DisplayService) {

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      code: ['', Validators.required],
      categoryId: ['', Validators.required],
      subCategoryId: ['', Validators.required],
      purities: ['', Validators.required],
      weight: [, Validators.required],
      unitName: ['g', Validators.required],
      availableQuantity: [1, Validators.required],
      isListed: [true, Validators.required]
    });
    this.data = this.modaldata.data;
    this.msg = this.modaldata.modalMsg;
  }

  ngOnInit(): void {
    this.getCategories();
    if (this.data) {
      if (this.data.hasOwnProperty('id')) {
        if (this.modaldata.action === 'viewOnly') {
          this.currentAction = true;
          this.title = 'Product Details';
          this.cancelButtonText = 'Close';
          this.productForm.disable();
        }
        else {
          this.title = 'Update Product Detail';
          this.productId = this.data.id;
        }
        this.buttonText = 'Update Product';
        this.setFormValue(this.data);
        this.isUpdate = true;
      }
    }
    else {
      this.title = 'New Product';
      this.buttonText = 'Add Product';
      this.isUpdate = false;
    }
  }

  getSubCategoryByCategory(categoryId: string){
    this.isLoading = true;
    this.subCategoryService.getSubCategoriesByCategory(categoryId).subscribe((response: any) => {
      if(response.data){
        this.subCategories = response.data;
        if(!this.isUpdate){
          this.productForm.get('subCategoryId')?.setValue(this.subCategories[0]._id);
        }
        this.isLoading = false;
      }
    })
  }

  getCategories() {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe((res: any) => {
      if (res.data) {
        this.categories = res.data;
        this.purities = this.categories[0].purities;
        if(!this.isUpdate){
          if(this.categories.length > 0){
            this.getSubCategoryByCategory(this.categories[0]._id);
          }
          this.selectedCategoryId = this.categories[0]._id;
          this.productForm.get('categoryId')?.setValue(this.selectedCategoryId);
          this.productForm.get('purities')?.setValue(this.purities[0]);
        }else{
          this.setFormValue(this.data);
        }
        this.isLoading = false;
      }
    });
  }

  selectedCategory(event: any){
    let filteredCategory = this.categories.filter(category => category._id === event.target.value);
    this.purities = filteredCategory[0].purities;
    this.productForm.get('purities')?.setValue(this.purities[0]);
    this.getSubCategoryByCategory(filteredCategory[0]._id);
  }

  setFormValue(detailToUpdate: any) {
    this.selectedCategoryId = detailToUpdate.categoryId;
    let filteredCategory = this.categories.filter(category => category._id === detailToUpdate.categoryId);
    this.purities = filteredCategory[0]?.purities;
    this.getSubCategoryByCategory(detailToUpdate.categoryId);
    this.productForm.get('name')?.setValue(detailToUpdate.name);
    this.productForm.get('description')?.setValue(detailToUpdate.description);
    this.productForm.get('code')?.setValue(detailToUpdate.productCode);
    this.productForm.get('categoryId')?.setValue(detailToUpdate.categoryId);
    this.productForm.get('subCategoryId')?.setValue(detailToUpdate.subCategoryId);
    this.productForm.get('purities')?.setValue(detailToUpdate.purity);
    this.productForm.get('weight')?.setValue(detailToUpdate.value);
    this.productForm.get('unitName')?.setValue(detailToUpdate.unitName);
    this.productForm.get('availableQuantity')?.setValue(detailToUpdate.quantity);
    this.productForm.get('isListed')?.setValue(detailToUpdate.isListed);
    this.imageFile = detailToUpdate.iconImage;
  }

  get f() {
    return this.productForm.controls;
  }

  closeDialog(isActionPerfomed?: boolean) {
    this.dialogRef.close(isActionPerfomed);
  }

  onSubmit(productForm: any) {
    this.isLoading = true;
    if (this.isUpdate) {
      const formData = new FormData();
      let weight = {
        "value": productForm.weight ? productForm.weight : '',
        "unitName": productForm.unitName ? productForm.unitName : ''
      }
      formData.append('name', productForm.name ? productForm.name : this.data.name);
      formData.append('description', productForm.description ? productForm.description : this.data.description);
      formData.append('code', productForm.code ? productForm.code : this.data.productCode);
      formData.append('purity', productForm.purities);
      formData.append('availableQuantity', productForm.availableQuantity ? productForm.availableQuantity : this.data.quantity);
      formData.append('iconImage', this.file);
      formData.append('weight', JSON.stringify(weight));
      formData.append('subCategoryId', productForm.subCategoryId);
      formData.append('isListed', productForm.isListed);
      this.productService.updateProduct(formData, this.productId).subscribe((response: any) => {
        if (response && response.data._id) {
          this.displayService.openSnackBar("Product Updated Successfully", '', 2000, 'top', 'right', 'success');
          this.productForm.reset();
          this.closeDialog(true);
          this.isLoading = false;
        }
      }, error => {
        this.isLoading = false;
        this.displayService.openSnackBar(error.error.message, '', 2000, 'top', 'right', 'danger');
      });
    } else {
      const formData = new FormData();
      let weight = {
        "value": productForm.weight,
        "unitName": productForm.unitName
      }
      formData.append('name', productForm.name);
      formData.append('description', productForm.description);
      formData.append('code', productForm.code);
      formData.append('purity', productForm.purities);
      formData.append('availableQuantity', productForm.availableQuantity);
      formData.append('weight', JSON.stringify(weight));
      formData.append('iconImage', this.file);
      formData.append('isListed', productForm.isListed);
      formData.append('subCategoryId', productForm.subCategoryId);
      this.productService.addProduct(formData).subscribe((response: any) => {
        if (response && response.data._id) {
          this.displayService.openSnackBar("Product Added Successfully", '', 2000, 'top', 'right', 'success');
          this.productForm.reset();
          this.closeDialog(true);
          this.isLoading = false;
        }
      }, error => {
        this.isLoading = false;
        this.displayService.openSnackBar(error.error.message, '', 2000, 'top', 'right', 'danger');
      });
    }
  }

  uploadMultipleImages(image: any, productId: string){
    const formData = new FormData();
    formData.append('image', image)
    this.productService.uploadImages(formData, productId).subscribe((response) => {
      if(response && response.status === "success"){
        this.displayService.openSnackBar("Product Image Uploaded Successfully", '', 2000, 'top', 'right', 'success');
      }
    }, error => {
      this.isLoading = false;
      this.displayService.openSnackBar("Something went wrong, Please try again!", '', 2000, 'top', 'right', 'danger');
    });
  }

  upload(){
    this.uploadMultipleImages(this.image, this.productId);
  }

  onSelectFile(e: any) {
    this.file = e.target.files[0];
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (e: any) => {
        this.imageFile = e.target.result;
      }
    }
  }

  onSelectImages(e: any) {
    this.image = e.target.files[0];
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      }
    }
  }

}
