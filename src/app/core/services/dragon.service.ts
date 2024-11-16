import { inject, Injectable } from '@angular/core';
import {
  Coordinates,
  Dragon,
  DragonCave,
  DragonHead,
  Person,
} from '@dg-core/types/models/dragon';
import { AbstractDragonService } from '@dg-core/services/abstract-dragon.service';
import { DragonsGetRequest } from '@dg-core/types/request.types';
import { PaginatedResponse } from '@dg-core/types/response.types';
import { environment } from '@dg-environment';
import {
  map,
  mergeMap,
  Observable,
  shareReplay,
  switchMap,
  toArray,
} from 'rxjs';
import { AuthService } from './auth.service';
import { DragonGetDao } from '@dg-core/types/models/daos/dragon.daos';

@Injectable({
  providedIn: 'root',
})
export class DragonService extends AbstractDragonService {
  protected readonly authService = inject(AuthService);

  private readonly dragonRequest$ = this.refreshDragonsList$.pipe(
    switchMap(() =>
      this.http.get<DragonGetDao[]>(`${environment.apiUrl}/dragons`, {
        headers: this.authService.getAuthHeaders(),
      })
    ),
    shareReplay({
      refCount: false,
      bufferSize: 1,
    })
  );

  override getDragonsList$(
    requestParams: DragonsGetRequest
  ): Observable<PaginatedResponse<Dragon>> {
    return this.dragonRequest$.pipe(
      map((daos) => {
        const data = daos.map((dao) => Dragon.fromGetDao(dao));

        return this.processDragonsList(data, requestParams);
      })
    );
  }

  override getDragonCavesList$(): Observable<DragonCave[]> {
    return this.getDependenciesList$('cave') as Observable<DragonCave[]>;
  }

  override getCoordinatesList$(): Observable<Coordinates[]> {
    return this.getDependenciesList$('coordinates') as Observable<
      Coordinates[]
    >;
  }

  override getDragonHeadsList$(): Observable<DragonHead[]> {
    return this.getDependenciesList$('head') as Observable<DragonHead[]>;
  }

  override getPeopleList$(): Observable<Person[]> {
    return this.getDependenciesList$('killer') as Observable<Person[]>;
  }

  override createDragon$(dragon: Dragon): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/dragons`,
      dragon.asCreateDao(),
      {
        headers: this.authService.getAuthHeaders(),
      }
    );
  }

  override removeDragon$(dragon: Dragon): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/dragons/${dragon.id}`,
      {
        headers: this.authService.getAuthHeaders(),
      }
    );
  }

  override updateDragon$(updatedDragon: Dragon): Observable<void> {
    return this.http.patch<void>(
      `${environment.apiUrl}/dragons/${updatedDragon.id}`,
      updatedDragon.asCreateDao(),
      { headers: this.authService.getAuthHeaders() }
    );
  }

  override getSumOfAges$(): Observable<number> {
    const url = `${environment.apiUrl}/special-commands/sum-dragon-ages`;

    return this.http.get<number>(url, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  override getDragonWithGigachadKiller$(): Observable<Dragon> {
    const url = `${environment.apiUrl}/special-commands/dragon-with-gigachad-killer`;

    return this.http
      .get<DragonGetDao>(url, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(map((dao) => Dragon.fromGetDao(dao)));
  }

  override searchDragonsByName$(searchQuery: string): Observable<Dragon[]> {
    const url = `${environment.apiUrl}/special-commands/find-dragons-by-name-substring`;

    return this.http
      .post<DragonGetDao[]>(url, searchQuery, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(
        mergeMap((dao) => dao),
        map((dao) => Dragon.fromGetDao(dao)),
        toArray()
      );
  }

  override getDragonInTheDeepestCave$(): Observable<Dragon> {
    const url = `${environment.apiUrl}/special-commands/dragon-with-the-deepest-cave`;

    return this.http
      .get<DragonGetDao>(url, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(map((dao) => Dragon.fromGetDao(dao)));
  }

  override createDragonKillersGang$(): Observable<void> {
    const url = `${environment.apiUrl}/special-commands/create-killers-gang`;

    return this.http.post<void>(url, null, {
      headers: this.authService.getAuthHeaders(),
    });
  }
}
