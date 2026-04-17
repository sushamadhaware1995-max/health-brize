import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from 'src/app/services/common.service';
import { Category } from 'src/app/shared/models/category';
import { AddCategory } from 'src/app/shared/models/addCategory';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  baseURL: string = '';
  private updateGrid = new BehaviorSubject(true);
  currentUpdateGridValue = this.updateGrid.asObservable();

  constructor( private commonService: CommonService,
    private http: HttpClient) {
    this.baseURL = this.commonService.baseURL;
   }

   getCategories(): Observable<Category>{
     let token = localStorage.getItem('token');
     const httpOptions = {
       headers: new HttpHeaders({
         'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
       }),
     };
     const apiUrl = this.baseURL + 'admin/categories';
     return this.http.get<any>(apiUrl, httpOptions);
   }

  addCategory(userPayload: any){
    let token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Acccept': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      }),
    };
    const apiUrl = this.baseURL + 'admin/categories';
    return this.http.post<any>(apiUrl, userPayload, httpOptions);
  }

  deleteCategory(categoryId: string): any {
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
    const apiUrl = this.baseURL + `admin/categories/${categoryId}`;
    return this.http.delete<any>(apiUrl, httpOptions);
  }

  changeUpdateGridValue(value: boolean) {
    this.updateGrid.next(value);
  }

  updateCategory(userPayload: any, categoryId : string){
    let token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Acccept': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      }),
    };
    const apiUrl = this.baseURL + `admin/categories/${categoryId}`;
    return this.http.patch<any>(apiUrl, userPayload, httpOptions);
  }


}
