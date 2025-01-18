import { OwnerGetDto } from './dragon.dtos';

export type ImportHistoryItemDto = {
  id?: number;
  status: ImportStatus;
  owner: OwnerGetDto;
  numberOfAddedObjects: number | null;
  fileUrl: string | null;
};

export enum ImportStatus {
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  NotSaved = 'NOT_SAVED',
}
