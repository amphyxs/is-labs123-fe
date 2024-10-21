import { PaginatedResponse } from '@dg-core/types/response.types';
import {
  Coordinates,
  Dragon,
  DragonCave,
  DragonHead,
  Person,
} from '@dg-core/types/models/dragon';
import {
  BehaviorSubject,
  distinct,
  map,
  mergeMap,
  Observable,
  toArray,
} from 'rxjs';
import {
  PaginatedRequest,
  SortedRequest,
  Filters,
  DragonsGetRequest,
} from '@dg-core/types/request.types';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Model } from '@dg-core/types/models/model';

export abstract class AbstractDragonService {
  protected readonly http = inject(HttpClient);

  readonly refreshDragonList$ = new BehaviorSubject(null);

  abstract getDragonsList$(
    requestParams: DragonsGetRequest
  ): Observable<PaginatedResponse<Dragon>>;

  abstract getPeopleList$(): Observable<Person[]>;

  abstract getCoordinatesList$(): Observable<Coordinates[]>;

  abstract getDragonHeadsList$(): Observable<DragonHead[]>;

  abstract getDragonCavesList$(): Observable<DragonCave[]>;

  abstract createDragon$(dragon: Dragon): Observable<void>;

  abstract updateDragon$(updatedDragon: Dragon): Observable<void>;

  abstract removeDragon$(dragon: Dragon): Observable<void>;

  abstract getSumOfAges$(): Observable<number>;

  abstract getDragonWithGigachadKiller$(): Observable<Dragon>;

  abstract searchDragonsByName$(name: string): Observable<Dragon[]>;

  abstract getDragonInTheDeepestCave$(): Observable<Dragon>;

  abstract createDragonKillersGang$(): Observable<void>;

  protected paginate<T>(data: T[], pagination: PaginatedRequest): T[] {
    const start = pagination.page * pagination.pageSize;
    const end = Math.min(
      (pagination.page + 1) * pagination.pageSize,
      data.length
    );

    return data.slice(start, end);
  }

  protected sort<T>(data: T[], sort: SortedRequest<T>): T[] {
    return data.sort((a, b) => {
      const key = sort.field as keyof T;
      return (
        (a[key]?.toString() ?? '').localeCompare(b[key]?.toString() ?? '') *
        sort.direction
      );
    });
  }

  protected filter<T>(data: T[], filters: Filters<T>): T[] {
    return data.filter((item) => {
      return Object.entries(filters).every(([_key, _value]) => {
        const key = _key as keyof T;
        const value = _value as string | undefined;
        return (
          item[key]?.toString().includes(value ?? '') ?? value === undefined
        );
      });
    });
  }

  protected getDependenciesList$(
    dependencyName: keyof Dragon
  ): Observable<Model[]> {
    return this.getDragonsList$({}).pipe(
      map((response) => response.data),
      mergeMap((dragons) => dragons),
      map((dragons) => dragons[dependencyName]),
      distinct((dependency) => dependency?.toString()),
      map((dependency) => dependency as Model),
      toArray()
    );
  }

  protected processDragonsList(
    dragons: Dragon[],
    requestParams: DragonsGetRequest
  ): PaginatedResponse<Dragon> {
    let data = dragons;
    const total = data.length;

    if (requestParams.pagination) {
      data = this.paginate(data, requestParams.pagination);
    }

    if (requestParams.sort) {
      data = this.sort(data, requestParams.sort);
    }

    if (requestParams.filters) {
      data = this.filter(data, requestParams.filters);
    }

    return {
      total,
      data,
    };
  }
}
