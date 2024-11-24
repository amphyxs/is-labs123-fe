import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ImportHistoryItemDto } from '@dg-core/types/models/dtos/import.dtos';
import { ImportHistoryItem } from '@dg-core/types/models/import';
import { environment } from '@dg-environment';
import { map } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ImportService {
  protected readonly http = inject(HttpClient);
  protected readonly authService = inject(AuthService);

  readonly importHistoryItems$ = this.http
    .get<ImportHistoryItemDto[]>(`${environment.apiUrl}/import`, {
      headers: this.authService.getAuthHeaders(),
    })
    .pipe(map((result) => result as ImportHistoryItem[]));
}
