import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DisplayService {

  private isFullViewLoaded = new BehaviorSubject<boolean>(true);
  currentIsFullViewLoaded = this.isFullViewLoaded.asObservable();
  
  isFullView:boolean = true;

  constructor(private _snackBar: MatSnackBar) { }

  openSnackBar(message: string, action: string, duration: number, verticalPosition: MatSnackBarVerticalPosition, horizontalPosition: MatSnackBarHorizontalPosition, type: string) {
    let panelClass = type === 'success' ? 'success' : 'error';
    this._snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: horizontalPosition,
      panelClass: [panelClass],
      verticalPosition: verticalPosition,
    });
  }

  changeIsFullViewLoaded(value : boolean){
    this.isFullViewLoaded.next(value);
  }
}
