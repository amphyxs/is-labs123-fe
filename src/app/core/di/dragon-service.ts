import { InjectionToken } from '@angular/core';
import { MockDragonsService } from '@dg-core/services/mock-dragons.service';
import { AbstractDragonService } from '@dg-core/services/abstract-dragon.service';
import { environment } from '@dg-environment';
import { DragonService } from '@dg-core/services/dragon.service';

export const DRAGON_SERVICE = new InjectionToken<AbstractDragonService>(
  'DragonService'
);

export const dragonServiceFactory = (): AbstractDragonService | null => {
  return environment.mockDragons
    ? new MockDragonsService()
    : new DragonService();
};
