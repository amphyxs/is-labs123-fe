import { Route } from '@angular/router';
import { HomeComponent } from '@dg-pages/home/home.component';
import { RegisterComponent } from '@dg-pages/register/register.component';
import { LoginComponent } from '@dg-pages/login/login.component';
import { authorizedGuard } from '@dg-core/guards/auth.guard';
import { ApproveNewAdminsComponent } from '@dg-pages/approve-new-admins/approve-new-admins.component';
import { adminGuard } from '@dg-core/guards/admin.guard';

export const appRoutes: Route[] = [
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'approve-new-admins',
    component: ApproveNewAdminsComponent,
    canActivate: [authorizedGuard, adminGuard],
  },
  {
    path: '**',
    component: HomeComponent,
    canActivate: [authorizedGuard],
  },
];
