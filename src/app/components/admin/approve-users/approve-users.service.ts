import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class ApproveUsersService {

  baseURL: string = '';
  token: any;
  
  constructor( private commonService: CommonService,
    private http: HttpClient) {
    this.baseURL = this.commonService.baseURL;
    this.token = this.commonService.token;
   }

  approveUser(id: string, payload: any){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      }),
    };
    const apiUrl = this.baseURL + `admin/users/${id}`;
    return this.http.patch<any>(apiUrl, payload, httpOptions);
  }
}
