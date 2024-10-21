import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '@dg-core/services/auth.service';
import { AdminRequestForApproval } from '@dg-core/types/models/admin-request-for-approval';
import { tuiTakeUntilDestroyed } from '@taiga-ui/cdk';
import { TuiButton } from '@taiga-ui/core';
import { BehaviorSubject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-approve-new-admins',
  standalone: true,
  imports: [TuiButton],
  templateUrl: './approve-new-admins.component.html',
  styleUrl: './approve-new-admins.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproveNewAdminsComponent {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly refreshAdminRequestsForApproval$ = new BehaviorSubject(null);

  adminRequestsForApproval = toSignal(
    this.refreshAdminRequestsForApproval$.pipe(
      tap(() => console.log('???')),
      switchMap(() => this.authService.getAdminRequestsForApproval$()),
      takeUntilDestroyed(this.destroyRef)
    )
  );

  approve(request: AdminRequestForApproval): void {
    this.authService
      .approveAdminRequest$(request)
      .pipe(tuiTakeUntilDestroyed(this.destroyRef))
      .subscribe({
        complete: () => this.refreshAdminRequestsForApproval$.next(null),
      });
  }
}
