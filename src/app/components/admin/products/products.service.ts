import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  baseURL: string = '';

  constructor(private commonService: CommonService,
    private http: HttpClient) {
    this.baseURL = this.commonService.baseURL;
  }

  getProducts(): Observable<any>{
    let token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
    const apiUrl = this.baseURL + 'admin/products';
    return this.http.get<any>(apiUrl, httpOptions);
  }

  addProduct(productPayload: any){
    let token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Acccept': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      }),
    };
    const apiUrl = this.baseURL + 'admin/products';
    return this.http.post<any>(apiUrl, productPayload, httpOptions);
  }

  updateProduct(productPayload: any, productId: string){
    let token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Acccept': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      }),
    };
    const apiUrl = this.baseURL + `admin/products/${productId}`;
    return this.http.patch<any>(apiUrl, productPayload, httpOptions);
  }

  deleteProduct(productId: string): any {
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
    const apiUrl = this.baseURL + `admin/products/${productId}`;
    return this.http.delete<any>(apiUrl, httpOptions);
  }

  uploadImages(imageArray: any, productId: string){
    let token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Acccept': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      }),
    };
    const apiUrl = this.baseURL + `admin/products/${productId}`;
    return this.http.put<any>(apiUrl, imageArray, httpOptions); 
  }
}
