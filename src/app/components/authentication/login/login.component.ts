import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Credentials } from 'src/app/shared/models/credentials';
import { DisplayService } from 'src/app/shared/services/display.service';

@Component({
  selector: 'admin-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  otpForm:  FormGroup;
  
  loadResendButton: boolean = false;
  isLoginBtnClicked: boolean = false;
  showResendButton: boolean = false;
  isLoading: boolean = false;
  
  phoneNumber: string = '';
  btnText: string = 'Login';

  counter: number = 30;
  counerId: any;

  constructor( private fb: FormBuilder,
    private authService: AuthenticationService,
    private displayService: DisplayService,
    private router: Router) {
      this.form = this.fb.group({
        phone: ['', Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10)
        ])]
      });

      this.otpForm = this.fb.group({
        digit1: ['', Validators.required],
        digit2: ['', Validators.required],
        digit3: ['', Validators.required],
        digit4: ['', Validators.required],
        digit5: ['', Validators.required],
        digit6: ['', Validators.required],
      });
    }

  ngOnInit(): void {
  }

  get f(){
    return this.form.controls;
  }
  
  onSubmit(data: any) {
    if(this.form.valid){
      this.isLoading = true;
      this.phoneNumber = data.phone;
      this.authService.login(data.phone).subscribe(res=> {
        if(res.message){
          this.displayService.openSnackBar(res.message, '', 3000, 'top', 'right', 'success');
          this.isLoading = false;
          this.isLoginBtnClicked = true;
          this.countdown();
          this.form.reset();
        }
      }, error => {
        this.displayService.openSnackBar(error.error.message, '', 3000, 'top', 'right', 'error');
        this.isLoading = false;
      });
    }else{
      this.isLoading = false;
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }

  onOtpFormSubmit(data:any){
    this.isLoading = true;
    let receivedOtp = `${data.digit1}${data.digit2}${data.digit3}${data.digit4}${data.digit5}${data.digit6}`;
    let credentials: Credentials = {
      phoneNumber : this.phoneNumber,
      otp : receivedOtp
    }
    if(data){
      this.authService.verifyOtp(credentials).subscribe((res: any)=> {
        if(res){
          this.isLoading = false;
          this.otpForm.reset();
          if(res.token){
            if(res.data.role === 'user'){
              this.displayService.openSnackBar('You do not have admin permissions', '', 3000, 'top', 'right', 'error');
              this.isLoginBtnClicked = false;
            }else if(res.data.role === 'admin' || res.data.role === 'employee'){
              this.displayService.openSnackBar('OTP Successfully verified', '', 3000, 'top', 'right', 'success');
              localStorage.setItem('token', res.token);
              this.router.navigate(['/healthbrize/']);
            }
          }
        }
      },error => {
        this.displayService.openSnackBar(error.error.message, '', 3000, 'top', 'right', 'error');
        this.isLoading = false;
      });
    }
  }

  requestOTP(phoneNumber: string){
    this.isLoading = true;
    this.authService.login(phoneNumber).subscribe(res=> {
      if(res.message){
        this.displayService.openSnackBar(res.message, '', 3000, 'top', 'right', 'success');
        this.isLoading = false;
        this.resendCode();
      }
    }, error => {
      this.displayService.openSnackBar(error.error.message, '', 3000, 'top', 'right', 'error');
      this.isLoading = false;
    });
  }

  countdown() {
    this.counerId = setInterval(() => {
      this.counter--;
      if (this.counter === -1) {
        this.showResendButton = true;
      }
    }, 1000);
  }

  resendCode() {
    this.counter = 30;
    this.showResendButton = false;
    clearInterval(this.counerId);
    this.countdown();
  }

  gotoNextField(currentElement:any, nextElement:any, event:any){
    if (event.code === 'Backspace') {
      currentElement.focus();
    }else{
      nextElement.focus();
    }
  }
}
