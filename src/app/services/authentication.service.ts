import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from './common.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserDetails } from '../shared/models/userDetails';
import { Credentials } from '../shared/models/credentials';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  baseURL: string = '';

  constructor(
    private router: Router,
    private commonService: CommonService,
    private http: HttpClient
  ) {
    this.baseURL = this.commonService.baseURL;
  }

  login(contact: string): Observable<any> {
    const data = {
      "phoneNumber":contact,
      "tnc": true
    }
    return this.http.post<any>(this.baseURL + 'users/login' , data);
  }

  verifyOtp(credentials: Credentials): Observable<UserDetails>{
    return this.http.post<UserDetails>(this.baseURL + 'users/verify' , credentials);

  }

  logout() {
    localStorage.removeItem("token");
    this.router.navigate(['/login']);
  }

  getToken(){
    return !!localStorage.getItem("token");
  }

  getUserProfile(){
    let token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
    const apiUrl = this.baseURL + 'users/me';
    return this.http.get<any>(apiUrl, httpOptions);
  }

}
