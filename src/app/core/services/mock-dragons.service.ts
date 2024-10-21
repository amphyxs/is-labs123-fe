import { Injectable } from '@angular/core';
import { mockDragons } from '@dg-core/mocks/dragon.mocks';
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
  distinct,
  EMPTY,
  filter,
  map,
  Observable,
  of,
  switchMap,
  timer,
  toArray,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MockDragonsService extends AbstractDragonService {
  readonly MAX_MOCK_DELAY_MS = 0;

  override getDragonsList$(
    requestParams: DragonsGetRequest
  ): Observable<PaginatedResponse<Dragon>> {
    return this.fakeDelay().pipe(
      map(() => {
        const data = mockDragons;
        this.dropRandomDragon(data);

        return this.processDragonsList(data, requestParams);
      })
    );
  }

  override getDragonCavesList$(): Observable<DragonCave[]> {
    return this.fakeDelay().pipe(
      switchMap(() => of(...mockDragons)),
      map((dragon) => dragon.cave),
      distinct((cave) => cave.numberOfTreasures),
      toArray()
    );
  }

  override getCoordinatesList$(): Observable<Coordinates[]> {
    return this.fakeDelay().pipe(
      switchMap(() => of(...mockDragons)),
      map((dragon) => dragon.coordinates),
      distinct((coords) => `${coords.x} ${coords.y}`),
      toArray()
    );
  }

  override getDragonHeadsList$(): Observable<DragonHead[]> {
    return this.fakeDelay().pipe(
      switchMap(() => of(...mockDragons)),
      map((dragon) => dragon.head),
      distinct((head) => head.size),
      toArray()
    );
  }

  override getPeopleList$(): Observable<Person[]> {
    return this.fakeDelay().pipe(
      switchMap(() => of(...mockDragons)),
      map((dragon) => dragon.killer),
      filter((killer) => !!killer),
      distinct((killer) => killer.name),
      toArray()
    );
  }

  override createDragon$(dragon: Dragon): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/dragons`,
      dragon.asCreateDao()
    );
  }

  override removeDragon$(dragon: Dragon): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/dragon/${dragon.id}`);
  }

  override updateDragon$(updatedDragon: Dragon): Observable<void> {
    return this.http.put<void>(
      `${environment.apiUrl}/dragon/${updatedDragon.id}`,
      updatedDragon.asCreateDao()
    );
  }

  override getSumOfAges$(): Observable<number> {
    return this.fakeDelay().pipe(
      switchMap(() => of(...mockDragons)),
      map((dragon) => dragon.age),
      filter((age) => !!age),
      map((age) => age as number),
      toArray<number>(),
      map((ages) => ages.reduce((acc, age) => acc + age, 0))
    );
  }

  override getDragonWithGigachadKiller$(): Observable<Dragon> {
    const dragons = mockDragons.slice();
    dragons.sort((a, b) => (b.killer?.height ?? 0) - (a.killer?.height ?? 0));

    return this.fakeDelay().pipe(map(() => dragons[0]));
  }

  override searchDragonsByName$(searchQuery: string): Observable<Dragon[]> {
    return this.fakeDelay().pipe(
      switchMap(() => of(...mockDragons)),
      filter((dragon) => dragon.name.includes(searchQuery)),
      toArray()
    );
  }

  override getDragonInTheDeepestCave$(): Observable<Dragon> {
    const dragons = mockDragons.slice();
    dragons.sort(
      (a, b) =>
        (b.cave.numberOfTreasures ?? 0) - (a.cave.numberOfTreasures ?? 0)
    );

    return this.fakeDelay().pipe(map(() => dragons[0]));
  }

  override createDragonKillersGang$(): Observable<void> {
    return EMPTY;
  }

  private dropRandomDragon(dragons: Dragon[]): void {
    const indexToDrop = Math.floor(Math.random() * dragons.length);
    console.log(`Drop ${indexToDrop}`);
    dragons.splice(indexToDrop, 1);
  }

  private fakeDelay(): Observable<0> {
    return timer(Math.random() * this.MAX_MOCK_DELAY_MS);
  }
}
