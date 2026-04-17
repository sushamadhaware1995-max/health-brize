import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      { 
        path: 'dashboard',
        loadChildren: () =>
        import('./dashboard/dashboard.module').then((m) => m.DashboardModule), 
      },
      { 
        path: 'approve-users',
        loadChildren: () =>
        import('./approve-users/approve-users.module').then((m) => m.ApproveUsersModule), 
      },
      { 
        path: 'users',
        loadChildren: () =>
        import('./user/user.module').then((m) => m.UserModule), 
      },
      { 
        path: 'categories',
        loadChildren: () =>
        import('./category/category.module').then((m) => m.CategoryModule), 
      },
      { 
        path: 'sub-categories',
        loadChildren: () =>
        import('./sub-category/sub-category.module').then((m) => m.SubCategoryModule), 
      },
      { 
        path: 'products',
        loadChildren: () =>
        import('./products/products.module').then((m) => m.ProductsModule), 
      },
      { 
        path: 'orders',
        loadChildren: () =>
        import('./orders/orders.module').then((m) => m.OrdersModule), 
      },
      { 
        path: 'doctors',
        loadChildren: () =>
        import('./doctor/doctor.module').then((m) => m.DoctorModule)
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
