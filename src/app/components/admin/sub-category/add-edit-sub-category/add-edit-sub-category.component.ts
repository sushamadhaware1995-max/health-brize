import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DisplayService } from 'src/app/shared/services/display.service';
import { CategoryService } from '../../category/category.service';
import { SubCategoryService } from '../sub-category.service';

@Component({
  selector: 'app-add-edit-sub-category',
  templateUrl: './add-edit-sub-category.component.html',
  styleUrls: ['./add-edit-sub-category.component.scss']
})
export class AddEditSubCategoryComponent implements OnInit {

  subCategoryForm: FormGroup;
  
  cancelButtonText: string = 'Cancel';
  buttonText: string = '';
  title: string = '';
  subCategoryId: string = '';

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
  
  purities: any[] = [];
  categories: any[] = [];
  imageFile: any;
  file: any;

  constructor(
    public dialogRef: MatDialogRef<AddEditSubCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public modaldata: any,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private displayService: DisplayService) {

    this.subCategoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      categoryId: ['', Validators.required],
      isListed: [true, Validators.required]
    });

    this.data = this.modaldata.data;
    this.msg = this.modaldata.modalMsg;
    if (this.data) {
      if (this.data.hasOwnProperty('id')) {
        if (this.modaldata.action === 'viewOnly') {
          this.currentAction = true;
          this.title = 'SubCategory Details';
          this.cancelButtonText = 'Close';
          this.subCategoryForm.disable();
        }
        else {
          this.title = 'Update SubCategory Detail';
          this.subCategoryId = this.data.id;
        }
        this.buttonText = 'Update SubCategory';
        this.setFormValue(this.data);
        this.isUpdate = true;
      }
    }
    else {
      this.title = 'New SubCategory';
      this.buttonText = 'Add SubCategory';
      this.isUpdate = false;
    }
  }

  ngOnInit(): void {
    this.getCategories();
  }

  addPurity() {
    let purity = this.subCategoryForm.get('purities')?.value;
    if(purity !== ''){
      if (this.purities.indexOf(purity) === -1) {
        this.purities.push(purity);
        this.subCategoryForm.get('purities')?.setValue('');
      } else {
        this.displayService.openSnackBar("Purity already exists!", '', 2000, 'top', 'right', 'danger');
      }
    }else{
      this.displayService.openSnackBar("Purity is required!", '', 2000, 'top', 'right', 'danger');
    }
  }

  removePurity(purity: string){
    let index = this.purities.indexOf(purity);
    this.purities.splice(index, 1);
  }

  setFormValue(detailToUpdate: any) {
    this.subCategoryForm.get('name')?.setValue(detailToUpdate.name);
    this.subCategoryForm.get('description')?.setValue(detailToUpdate.description);
    this.subCategoryForm.get('categoryId')?.setValue(detailToUpdate.categoryId);
    this.subCategoryForm.get('isListed')?.setValue(detailToUpdate.isListed);
    this.imageFile = detailToUpdate.iconImage;
    this.purities = detailToUpdate.purities;
  }

  get f() {
    return this.subCategoryForm.controls;
  }

  closeDialog(isActionPerfomed?: boolean) {
    this.dialogRef.close(isActionPerfomed);
  }

  onSubmit(subCategoryForm: any) {
    this.isLoading = true;
    if (this.isUpdate) {
      const formData = new FormData();
      formData.append('name', subCategoryForm.name ? subCategoryForm.name : this.data.name);
      formData.append('description', subCategoryForm.description ? subCategoryForm.description : this.data.description);
      formData.append('categoryId', subCategoryForm.categoryId ? subCategoryForm.categoryId : this.data.categoryId);
      formData.append('iconImage', this.file);
      formData.append('isListed', subCategoryForm.isListed ? subCategoryForm.isListed : this.data.isListed);
      this.subCategoryService.updateSubCategory(formData, this.subCategoryId).subscribe((response: any) => {
        if (response && response.data._id) {
          this.displayService.openSnackBar("SubCategory Updated Successfully", '', 2000, 'top', 'right', 'success');
          this.subCategoryForm.reset();
          this.closeDialog(true);
          this.isLoading = false;
        }
      }, error => {
        this.isLoading = false;
        this.displayService.openSnackBar(error.error.message, '', 2000, 'top', 'right', 'danger');
      });
    } else {
      // console.log('sub', subCategoryForm)
      const formData = new FormData();
      formData.append('name', subCategoryForm.name);
      formData.append('description', subCategoryForm.description);
      formData.append('categoryId', subCategoryForm.categoryId);
      formData.append('iconImage', this.file);
      formData.append('isListed', subCategoryForm.isListed);
      this.subCategoryService.addSubCategory(formData).subscribe((response: any) => {
        if (response && response.data._id) {
          this.displayService.openSnackBar("SubCategory Added Successfully", '', 2000, 'top', 'right', 'success');
          this.subCategoryForm.reset();
          this.closeDialog(true);
          this.isLoading = false;
        }
      }, error => {
        this.isLoading = false;
        this.displayService.openSnackBar(error.error.message, '', 2000, 'top', 'right', 'danger');
      });
    }
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

  getCategories() {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe((res: any) => {
      if (res.data) {
        this.categories = res.data;
        if(!this.isUpdate){
          // this.selectedCategoryId = this.categories[0]._id;
          // this.productForm.get('categoryId')?.setValue(this.selectedCategoryId);
          // this.purities = this.categories[0].purities;
          // this.productForm.get('purities')?.setValue(this.purities[0]);
        }
        this.isLoading = false;
      }
    });
  }

  selectedCategory(event: any){
    let filteredCategory = this.categories.filter(category => category._id === event.target.value);
    this.purities = filteredCategory[0].purities;
  }
}
