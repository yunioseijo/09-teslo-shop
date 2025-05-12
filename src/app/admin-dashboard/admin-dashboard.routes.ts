import { Routes } from '@angular/router';
import { AdminDashboardLayoutComponent } from './layouts/admin-dashboard-layout/admin-dashboard-layout.component';
import { ProductAdminPageComponent } from './pages/product-admin-page/product-admin-page.component';

export const ADMIN_DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: AdminDashboardLayoutComponent,
    children: [
      {
        path: 'products',
        component: ProductAdminPageComponent,
      },
      {
        path: 'product/:id',
        component: ProductAdminPageComponent,
      },
      {
        path: '**',
        redirectTo: 'products',
      },
    ],
  },
];
export default ADMIN_DASHBOARD_ROUTES;
