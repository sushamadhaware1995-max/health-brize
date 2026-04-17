import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  baseURL: string = '';

  constructor(
    private commonService: CommonService,
    private http: HttpClient
  ) { 
    this.baseURL = this.commonService.baseURL;
  }

  getOrders(){
    let token = localStorage.getItem('token');
     const httpOptions = {
       headers: new HttpHeaders({
         'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
       }),
     };
     const apiUrl = this.baseURL + 'admin/orders';
     return this.http.get<any>(apiUrl, httpOptions);
  }

  updateOrderStatus(orderId: string, payload: any){
    let token = localStorage.getItem('token');
     const httpOptions = {
       headers: new HttpHeaders({
         'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
       }),
     };
     const apiUrl = this.baseURL + 'admin/orders/' + orderId;
     return this.http.patch<any>(apiUrl, payload, httpOptions);
  }
}
