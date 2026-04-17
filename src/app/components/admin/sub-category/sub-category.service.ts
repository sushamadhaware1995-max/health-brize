import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { Category } from 'src/app/shared/models/category';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {

  baseURL: string = '';
  private updateGrid = new BehaviorSubject(true);
  currentUpdateGridValue = this.updateGrid.asObservable();

  constructor( private commonService: CommonService,
    private http: HttpClient) {
    this.baseURL = this.commonService.baseURL;
   }

   getSubCategories(): Observable<Category>{
     let token = localStorage.getItem('token');
     const httpOptions = {
       headers: new HttpHeaders({
         'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
       }),
     };
     const apiUrl = this.baseURL + 'admin/subCategories';
     return this.http.get<any>(apiUrl, httpOptions);
   }

   getSubCategoriesByCategory(categoryId: string): Observable<Category>{
    let token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
    const apiUrl = this.baseURL + 'admin/subCategories?categoryId=' + categoryId + '&isListed=true';
    return this.http.get<any>(apiUrl, httpOptions);
  }

  addSubCategory(subCategoryPayload: any){
    let token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Acccept': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      }),
    };
    const apiUrl = this.baseURL + 'admin/subCategories';
    return this.http.post<any>(apiUrl, subCategoryPayload, httpOptions);
  }

  deleteSubCategory(subcategoryId: string): any {
    let token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
    let payload = {
      isActive: false
    }
    const apiUrl = this.baseURL + `admin/subCategories/${subcategoryId}`;
    return this.http.delete<any>(apiUrl, httpOptions);
  }

  changeUpdateGridValue(value: boolean) {
    this.updateGrid.next(value);
  }

  updateSubCategory(userPayload: any, subcategoryId : string){
    let token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Acccept': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      }),
    };
    const apiUrl = this.baseURL + `admin/subCategories/${subcategoryId}`;
    return this.http.patch<any>(apiUrl, userPayload, httpOptions);
  }

}
