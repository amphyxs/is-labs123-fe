import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@dg-core/services/auth.service';
import { AccountType } from '@dg-core/types/models/user';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser?.accountType === AccountType.Admin
    ? true
    : router.parseUrl('/..');
};
