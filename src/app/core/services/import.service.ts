import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ImportHistoryItemDto } from '@dg-core/types/models/dtos/import.dtos';
import { ImportHistoryItem } from '@dg-core/types/models/import';
import { environment } from '@dg-environment';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ImportService {
  protected readonly http = inject(HttpClient);
  protected readonly authService = inject(AuthService);

  readonly IMPORT_FILE_TYPE = 'application/json';

  readonly refreshImportHistoryItems$ = new BehaviorSubject(undefined);
  readonly importHistoryItems$ = this.refreshImportHistoryItems$.pipe(
    switchMap(() =>
      this.http.get<ImportHistoryItemDto[]>(`${environment.apiUrl}/import`, {
        headers: this.authService.getAuthHeaders(),
      })
    ),
    map((result) => result as ImportHistoryItem[])
  );

  uploadImportFile(importFile: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', importFile);

    return this.http
      .post(`${environment.apiUrl}/import`, formData, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(
        map(() => {
          return;
        })
      );
  }
}
