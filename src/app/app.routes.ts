import { Routes } from '@angular/router';
import { IsAdminGuard } from '@auth/guards/is-admin.guards';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guards';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [NotAuthenticatedGuard,],
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin-dashboard/admin-dashboard.routes'),
  },
  {
    path: '',
    loadChildren: () => import ('./store-front/store-front.routes'),

  }
];
