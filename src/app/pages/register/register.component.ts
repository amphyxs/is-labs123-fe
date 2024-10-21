import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '@dg-core/services/auth.service';
import {
  TuiAlertService,
  TuiButton,
  TuiIcon,
  TuiLabel,
  TuiLink,
  TuiSurface,
  TuiTextfield,
} from '@taiga-ui/core';
import { TuiCheckbox, TuiPassword } from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiCardLarge,
    TuiSurface,
    TuiTextfield,
    TuiLabel,
    TuiCheckbox,
    TuiButton,
    TuiLink,
    TuiIcon,
    TuiPassword,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrls: [
    './register.component.less',
    '../../shared/styles/auth-pages.less',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  protected readonly authService = inject(AuthService);
  protected readonly alertService = inject(TuiAlertService);
  protected readonly destroyRef = inject(DestroyRef);

  readonly registrationForm = new FormGroup({
    username: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    password: new FormControl<string>('', {
      validators: [Validators.required, Validators.minLength(8)],
      nonNullable: true,
    }),
    isAdmin: new FormControl<boolean>(false, { nonNullable: true }),
  });

  register() {
    if (!this.registrationForm.valid) {
      this.alertService
        .open('Form is invalid!')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();

      return;
    }

    this.authService
      .register({
        username: this.registrationForm.get('username')!.value,
        password: this.registrationForm.get('password')!.value,
      })
      .subscribe({
        complete: () => {
          const hasAdminRequest = this.registrationForm.get('isAdmin')!.value;

          if (!hasAdminRequest) {
            this.authService.redirectAfterAuth();
            return;
          }

          this.authService
            .requestAdminRights()
            .pipe(
              catchError((err: Error) => {
                return this.alertService
                  .open(err.message, { appearance: 'error' })
                  .pipe(takeUntilDestroyed(this.destroyRef));
              }),
              takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
              complete: () => this.authService.redirectAfterAuth(),
            });
        },
        error: (err: Error) => {
          this.alertService
            .open(err.message, { appearance: 'error' })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
        },
      });
  }
}
