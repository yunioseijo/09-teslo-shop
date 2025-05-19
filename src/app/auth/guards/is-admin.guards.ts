import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const IsAdminGuard: CanMatchFn = async(
  route: Route,
  segments: UrlSegment[]
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAdmin = authService.isAdmin();

  await firstValueFrom(authService.checkAuthStatus());
  // console.log('isAdmin', isAdmin);

  return authService.isAdmin();

}
