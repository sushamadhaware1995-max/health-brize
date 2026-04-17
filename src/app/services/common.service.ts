import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { merge, fromEvent, map, Observable, Observer } from 'rxjs';
import { DisplayService } from '../shared/services/display.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  baseURL: string = 'https://apointment-api.herokuapp.com/api/';
  token: any;

  constructor(private http: HttpClient,
    private displayService: DisplayService) {
    this.token = localStorage.getItem('token');
    this.createOnline$().subscribe(isOnline => {
      if (!isOnline) {
        this.displayService.openSnackBar("No Internet! Please connect to a Network", '', 3000, 'top', 'right', 'error');
      } else {
        this.displayService.openSnackBar("Internet Connection is Successful", '', 3000, 'top', 'right', 'success');
      }
    });
  }

  createOnline$() {
    return merge<any>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
    }));
  }

  getStats(){
    let token = localStorage.getItem('token');
     const httpOptions = {
       headers: new HttpHeaders({
         'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
       }),
     };
    const apiUrl = this.baseURL + 'admin/stats';
    return this.http.get<any>(apiUrl, httpOptions);
  }

  async post(url: string, body: any, contentType = 'application/json'): Promise<any> {
    return this.http.post(this.baseURL + url, body, this.getHeaders(contentType)).toPromise()
      .then((response: any) => {
        if (response && response.status == false) {
          throw new Error(response.message);
        }
        return Promise.resolve(response);
      }).catch((e) => {
        return Promise.reject(e);
      });

  }

  async get(url: string, contentType = 'application/json'): Promise<any> {
    return this.http.get(this.baseURL + url, this.getHeaders(contentType)).toPromise()
      .then((response: any) => {
        if (response && response.status == false) {
          throw new Error(response.message);
        }
        return Promise.resolve(response);
      })
      .catch((e) => {
        return Promise.reject(e);
      });
  }

  async patch(url: string, body: any, contentType = 'application/json'): Promise<any> {
    return this.http.patch(this.baseURL + url, body, this.getHeaders(contentType)).toPromise()
      .then((response: any) => {
        if (response && response.status == false) {
          throw new Error(response.message);
        }
        return Promise.resolve(response);
      }).catch((e) => {
        return Promise.reject(e);
      });

  }

  async postFormData(url: string, body: FormData, contentType = 'application/x-www-form-urlencoded'): Promise<any> {
    return this.http.post(this.baseURL + url, body).toPromise()
      .then((response: any) => {
        if (response && response.status == false) {
          throw new Error(response.message);
        }
        return Promise.resolve(response);
      }).catch((e) => {
        return Promise.reject(e);
      });
  }

  async patchFormData(url: string, body: any, contentType = 'application/x-www-form-urlencoded'): Promise<any> {
    return this.http.patch(this.baseURL + url, body).toPromise()
      .then((response: any) => {
        if (response && response.status == false) {
          throw new Error(response.message);
        }
        return Promise.resolve(response);
      }).catch((e) => {
        return Promise.reject(e);
      });
  }

  put(url: string, contentType = 'application/json'): Promise<any> {
    return this.http.put(this.baseURL + url, this.getHeaders(contentType)).toPromise();
  }

  private getHeaders(contentType: string): any {
    return {
      headers: new HttpHeaders({
        'Content-Type': contentType,
        'Accept': 'application/json, text/plain, */*'
      })
    };
  }
}