import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guards';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [NotAuthenticatedGuard,],
  },
  {
    path: '',
    loadChildren: () => import ('./store-front/store-front.routes').then(m => m.STORE_FRONT_ROUTES),

  }
];
