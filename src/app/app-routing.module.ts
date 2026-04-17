import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './shared/guards/authentication.guard';
import { AutoLoginGuardGuard } from './shared/guards/auto-login-guard.guard';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full'
  },
  { 
    path: 'healthbrize',
    loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthenticationGuard]
  },
  { 
    path: 'login',
    loadChildren: () => import('./components/authentication/login/login.module').then(m => m.LoginModule),
    canActivate: [AutoLoginGuardGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
