import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorComponent } from './doctor.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'all-doctors',
    pathMatch: 'full',
  },
  {
    path: 'all-doctors',
    component: DoctorComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoctorRoutingModule {}
