import { Component, OnInit, Inject } from '@angular/core';
import { CategoryService } from '../category.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DisplayService } from 'src/app/shared/services/display.service';

@Component({
  selector: 'app-add-edit-category',
  templateUrl: './add-edit-category.component.html',
  styleUrls: ['./add-edit-category.component.scss']
})
export class AddEditCategoryComponent implements OnInit {

  categoryForm: FormGroup;
  
  cancelButtonText: string = 'Cancel';
  buttonText: string = '';
  title: string = '';
  categoryId: string = '';

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
  imageFile: any;
  file: any;

  constructor(
    public dialogRef: MatDialogRef<AddEditCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public modaldata: any,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private displayService: DisplayService) {

    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      purities: ['', Validators.required],
      isListed: [true, Validators.required]
    });

    this.data = this.modaldata.data;
    this.msg = this.modaldata.modalMsg;
    if (this.data) {
      if (this.data.hasOwnProperty('_id')) {
        if (this.modaldata.action === 'viewOnly') {
          this.currentAction = true;
          this.title = 'Category Details';
          this.cancelButtonText = 'Close';
          this.categoryForm.disable();
        }
        else {
          this.title = 'Update Category Detail';
          this.categoryId = this.data._id;
        }
        this.buttonText = 'Update Category';
        this.setFormValue(this.data);
        this.isUpdate = true;
      }
    }
    else {
      this.title = 'New Category';
      this.buttonText = 'Add Category';
      this.isUpdate = false;
    }
  }

  ngOnInit(): void {
  }

  addPurity() {
    let purity = this.categoryForm.get('purities')?.value;
    if(purity !== ''){
      if (this.purities.indexOf(purity) === -1) {
        this.purities.push(purity);
        this.categoryForm.get('purities')?.setValue('');
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
    this.categoryForm.get('name')?.setValue(detailToUpdate.name);
    this.categoryForm.get('description')?.setValue(detailToUpdate.description);
    this.categoryForm.get('isListed')?.setValue(detailToUpdate.isListed);
    this.imageFile = detailToUpdate.iconImage;
    this.purities = detailToUpdate.purities;
  }

  get f() {
    return this.categoryForm.controls;
  }

  closeDialog(isActionPerfomed?: boolean) {
    this.dialogRef.close(isActionPerfomed);
  }

  onSubmit(categoryForm: any) {
    this.isLoading = true;
    if (this.isUpdate) {
      const formData = new FormData();
      formData.append('name', categoryForm.name ? categoryForm.name : this.data.name);
      formData.append('description', categoryForm.description ? categoryForm.description : this.data.description);
      formData.append('purities', JSON.stringify(this.purities));
      formData.append('iconImage', this.file);
      formData.append('isListed', categoryForm.isListed ? categoryForm.isListed : this.data.isListed);
      this.categoryService.updateCategory(formData, this.categoryId).subscribe((response: any) => {
        if (response && response.data._id) {
          this.displayService.openSnackBar("Category Updated Successfully", '', 2000, 'top', 'right', 'success');
          this.categoryForm.reset();
          this.closeDialog(true);
          this.isLoading = false;
        }
      }, error => {
        this.isLoading = false;
        this.displayService.openSnackBar(error.error.message, '', 2000, 'top', 'right', 'danger');
      });
    } else {
      const formData = new FormData();
      formData.append('name', categoryForm.name);
      formData.append('description', categoryForm.description);
      formData.append('purities', JSON.stringify(this.purities));
      formData.append('iconImage', this.file);
      formData.append('isListed', categoryForm.isListed);
      this.categoryService.addCategory(formData).subscribe((response: any) => {
        if (response && response.data._id) {
          this.displayService.openSnackBar("Category Added Successfully", '', 2000, 'top', 'right', 'success');
          this.categoryForm.reset();
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
}
