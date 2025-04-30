import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import ('./store-front/store-front.routes').then(m => m.STORE_FRONT_ROUTES),

  }
];
