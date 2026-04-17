import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApproveUsersComponent } from './approve-users.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'approve-user',
    pathMatch: 'full',
  },
  {
    path: 'approve-user',
    component: ApproveUsersComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApproveUserRoutingModule {}
