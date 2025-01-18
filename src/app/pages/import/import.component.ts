import { AsyncPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@dg-core/services/auth.service';
import { ImportService } from '@dg-core/services/import.service';
import { ImportStatus } from '@dg-core/types/models/dtos/import.dtos';
import { TuiAlertService, TuiAppearance, TuiButton } from '@taiga-ui/core';
import { TuiBadge, TuiFiles } from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout';
import { catchError, filter, mergeMap, tap } from 'rxjs';

@Component({
  selector: 'app-import',
  standalone: true,
  imports: [
    TuiCardLarge,
    TuiAppearance,
    TuiBadge,
    ReactiveFormsModule,
    TuiButton,
    TuiFiles,
    AsyncPipe,
  ],
  templateUrl: './import.component.html',
  styleUrl: './import.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportComponent {
  protected readonly importService = inject(ImportService);
  protected readonly authService = inject(AuthService);
  protected readonly alertService = inject(TuiAlertService);
  protected readonly destroyRef = inject(DestroyRef);

  importHistoryItems = toSignal(this.importService.importHistoryItems$);

  uploadedImportFile = new FormControl<File | null>(null);

  constructor() {
    this.uploadedImportFile.valueChanges
      .pipe(
        filter((value) => !!value),
        mergeMap((file) => {
          return this.importService.uploadImportFile(file);
        }),
        catchError((e: HttpErrorResponse, originalObservable) => {
          if (e.status === 503) {
            this.showErrorServiceUnavailable();

            this.importService.refreshImportHistoryItems$.next([
              ...this.importHistoryItems()!,
              {
                fileUrl: null,
                numberOfAddedObjects: null,
                owner: this.authService.currentUser!,
                status: ImportStatus.NotSaved,
              },
            ]);

            return originalObservable;
          }

          throw e;
        }),
        tap(() => {
          this.importService.refreshImportHistoryItems$.next(null);
        })
      )
      .subscribe();
  }

  private showErrorServiceUnavailable() {
    this.alertService
      .open('Server is unavailable', { appearance: 'error' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
