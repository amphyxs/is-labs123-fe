import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AdminRequestForApproval } from '@dg-core/types/models/admin-request-for-approval';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export abstract class AbstractAuthService {
  protected readonly http = inject(HttpClient);

  abstract getAdminRequestsForApproval$(): Observable<
    AdminRequestForApproval[]
  >;
}
