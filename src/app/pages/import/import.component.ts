import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '@dg-core/services/auth.service';
import { ImportService } from '@dg-core/services/import.service';
import { TuiAppearance, TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiBadge } from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout';

@Component({
  selector: 'app-import',
  standalone: true,
  imports: [TuiCardLarge, TuiAppearance, TuiBadge, TuiIcon, TuiButton],
  templateUrl: './import.component.html',
  styleUrl: './import.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportComponent {
  protected readonly importService = inject(ImportService);
  protected readonly authService = inject(AuthService);

  importHistoryItems = toSignal(this.importService.importHistoryItems$);
}
