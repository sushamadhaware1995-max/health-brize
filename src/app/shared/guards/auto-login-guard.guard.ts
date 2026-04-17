import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuardGuard implements CanActivate {
  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}
  
  canActivate(): boolean {
    if(this.loginService.getToken()) {
      this.router.navigate(['/healthbrize/']);
      return false;
    }else {
      return true;
    }
  }
  
}
