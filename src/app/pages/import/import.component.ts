import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@dg-core/services/auth.service';
import { ImportService } from '@dg-core/services/import.service';
import { tuiTakeUntilDestroyed } from '@taiga-ui/cdk';
import { TuiAppearance } from '@taiga-ui/core';
import { TuiBadge, TuiFiles } from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-import',
  standalone: true,
  imports: [
    TuiCardLarge,
    TuiAppearance,
    TuiBadge,
    ReactiveFormsModule,
    TuiFiles,
  ],
  templateUrl: './import.component.html',
  styleUrl: './import.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportComponent {
  protected readonly importService = inject(ImportService);
  protected readonly authService = inject(AuthService);

  importHistoryItems = toSignal(this.importService.importHistoryItems$);

  uploadedImportFile = new FormControl<File | null>(null);

  constructor() {
    this.uploadedImportFile.valueChanges
      .pipe(
        filter((value) => !!value),
        switchMap((file) => {
          return this.importService.uploadImportFile(file);
        }),
        tap(() =>
          this.importService.refreshImportHistoryItems$.next(undefined)
        ),
        tuiTakeUntilDestroyed()
      )
      .subscribe();
  }
}
