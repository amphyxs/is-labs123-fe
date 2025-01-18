import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ImportHistoryItemDto } from '@dg-core/types/models/dtos/import.dtos';
import { ImportHistoryItem } from '@dg-core/types/models/import';
import { environment } from '@dg-environment';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ImportService {
  protected readonly http = inject(HttpClient);
  protected readonly authService = inject(AuthService);

  readonly IMPORT_FILE_TYPE = 'application/json';

  readonly refreshImportHistoryItems$ = new BehaviorSubject<
    ImportHistoryItem[] | null
  >(null);
  readonly importHistoryItems$ = this.refreshImportHistoryItems$.pipe(
    switchMap((manualValue) =>
      manualValue
        ? of(manualValue)
        : this.http
            .get<ImportHistoryItemDto[]>(`${environment.apiUrl}/import`, {
              headers: this.authService.getAuthHeaders(),
            })
            .pipe(
              catchError(() => of([])), // Return empty array on error
              map((result) => result as ImportHistoryItem[]) // Map to final desired type
            )
    )
  );

  uploadImportFile(importFile: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', importFile);

    return this.http
      .post(`${environment.apiUrl}/import/file`, formData, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(
        map(() => {
          return;
        })
      );
  }
}
