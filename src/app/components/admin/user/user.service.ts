import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AddUserData } from 'src/app/shared/models/addUser';
import { updateUserData } from 'src/app/shared/models/updateUser';
import { UserList } from 'src/app/shared/models/userDetails';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseURL: string = '';
  private updateGrid = new BehaviorSubject(true);
  currentUpdateGridValue = this.updateGrid.asObservable();

  constructor( private commonService: CommonService,
    private http: HttpClient) {
    this.baseURL = this.commonService.baseURL;
   }

  getUsers(): Observable<UserList>{
     let token = localStorage.getItem('token');
     const httpOptions = {
       headers: new HttpHeaders({
         'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
       }),
     };
     const apiUrl = this.baseURL + 'admin/users';
     return this.http.get<any>(apiUrl, httpOptions).pipe(shareReplay());
   }

   deleteUser(userId: string): any {
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
    const apiUrl = this.baseURL + `admin/users/${userId}`;
    return this.http.delete<any>(apiUrl, httpOptions);
  }

  addUser(userPayload: AddUserData){
    let token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
    const apiUrl = this.baseURL + 'admin/users';
    return this.http.post<any>(apiUrl, userPayload, httpOptions);
  }

  updateUserDetails(userId: string, userPayload: updateUserData){
    let token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
    const apiUrl = this.baseURL + `admin/users/${userId}`;
    return this.http.patch<any>(apiUrl, userPayload, httpOptions);
  }

  blockUser(payload: any, userId: string){
    let token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
    const apiUrl = this.baseURL + `admin/users/${userId}`;
    return this.http.patch<any>(apiUrl, payload, httpOptions);
  }

  changeUpdateGridValue(value: boolean) {
    this.updateGrid.next(value);
  }
 
}
