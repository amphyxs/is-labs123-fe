import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@dg-core/services/auth.service';
import { AccountType } from '@dg-core/types/models/user';
import { environment } from '@dg-environment';
import { map } from 'rxjs';

export const authorizedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (environment.mockAuthForTesting) {
    authService.currentUser = {
      username: 'admin',
      token: '12345',
      accountType: AccountType.Admin,
    };

    return true;
  } else if (authService.isAuthenticated) {
    return true;
  } else {
    return authService
      .authViaToken()
      .pipe(map((isSuccess) => (isSuccess ? true : router.parseUrl('/login'))));
  }
};
