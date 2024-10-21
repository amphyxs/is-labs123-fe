import { Dragon } from './models/dragon';

export type Filters<TEntity> = Partial<Record<keyof TEntity, string>>;

export type SortedRequest<TEntity> = {
  field: keyof TEntity;
  direction: SortDirection;
};

export type PaginatedRequest = {
  page: number;
  pageSize: number;
};

export type DragonsGetRequest = {
  filters?: Filters<Dragon>;
  sort?: SortedRequest<Dragon>;
  pagination?: PaginatedRequest;
};

export enum SortDirection {
  Ascending = 1,
  Descending = -1,
}
