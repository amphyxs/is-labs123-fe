import { OwnerGetDto } from './dragon.dtos';

export type ImportHistoryItemDto = {
  id: number;
  status: ImportStatus;
  owner: OwnerGetDto;
  numberOfAddedObjects: number | null;
};

export enum ImportStatus {
  Completed = 'COMPLETED',
  Failed = 'FAILED',
}
