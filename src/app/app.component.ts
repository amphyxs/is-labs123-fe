import { Component, DestroyRef, inject, INJECTOR, signal } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';
import { KeyValuePipe, NgForOf } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiRepeatTimes, tuiTakeUntilDestroyed } from '@taiga-ui/cdk';
import {
  TuiAlertService,
  TuiAppearance,
  TuiButton,
  TuiDataList,
  TuiDialogContext,
  TuiDialogService,
  TuiDropdown,
  TuiIcon,
  TuiRoot,
  TuiSurface,
  TuiTextfield,
  TuiTitle,
} from '@taiga-ui/core';
import {
  TuiAvatar,
  TuiBadge,
  TuiBadgeNotification,
  TuiChevron,
  TuiDataListDropdownManager,
  TuiFade,
  TuiSwitch,
  TuiTabs,
} from '@taiga-ui/kit';
import { TuiCardLarge, TuiHeader, TuiNavigation } from '@taiga-ui/layout';
import { appRoutes } from './app.routes';
import { DragonFormComponent } from '@dg-shared/components/dragon-form/dragon-form.component';
import {
  PolymorpheusComponent,
  PolymorpheusContent,
} from '@taiga-ui/polymorpheus';
import {
  DRAGON_SERVICE,
  dragonServiceFactory,
} from '@dg-core/di/dragon-service';
import { switchMap } from 'rxjs';
import { Dragon } from '@dg-core/types/models/dragon';
import { HomeComponent } from './pages/home/home.component';
import { ActionWithDragon } from '@dg-core/types/action-with-dragon.types';
import { AuthService } from '@dg-core/services/auth.service';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    TuiRoot,
    TuiButton,
    FormsModule,
    KeyValuePipe,
    NgForOf,
    RouterLink,
    RouterLinkActive,
    TuiAppearance,
    TuiAvatar,
    TuiBadge,
    TuiBadgeNotification,
    TuiButton,
    TuiCardLarge,
    TuiChevron,
    TuiDataList,
    TuiDataListDropdownManager,
    TuiDropdown,
    TuiFade,
    TuiHeader,
    TuiIcon,
    TuiNavigation,
    TuiRepeatTimes,
    TuiSurface,
    TuiSwitch,
    TuiTabs,
    TuiTitle,
    TuiTextfield,
    ReactiveFormsModule,
    HomeComponent,
  ],
  providers: [
    {
      provide: DRAGON_SERVICE,
      useFactory: dragonServiceFactory,
    },
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent {
  protected readonly dialogService = inject(TuiDialogService);
  protected readonly injector = inject(INJECTOR);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly dragonService = inject(DRAGON_SERVICE);
  protected readonly alertService = inject(TuiAlertService);
  protected readonly authService = inject(AuthService);
  protected readonly router = inject(Router);

  protected expanded = false;
  protected open = false;
  protected switch = false;
  protected readonly routes = appRoutes;
  protected readonly searchDragonByNameControl = new FormControl('');
  protected readonly foundDragonsByName = signal<Dragon[]>([]);

  createNewDragon(): void {
    this.dialogService
      .open<{ mode: ActionWithDragon }>(
        new PolymorpheusComponent(DragonFormComponent, this.injector),
        {
          data: {
            mode: ActionWithDragon.Create,
          },
          dismissible: true,
          label: 'Create dragon',
        }
      )
      .pipe(tuiTakeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.dragonService.refreshDragonsList$.next(null),
      });
  }

  sumAges(): void {
    this.dragonService
      .getSumOfAges$()
      .pipe(
        switchMap((sum) =>
          this.dialogService.open(sum, {
            label: "Sum of every objects' ages",
            size: 's',
          })
        ),
        tuiTakeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  showDragonWithGigachadKiller(): void {
    this.dragonService
      .getDragonWithGigachadKiller$()
      .pipe(
        switchMap((item) =>
          this.dialogService.open<{ item: Dragon; mode: ActionWithDragon }>(
            new PolymorpheusComponent(DragonFormComponent, this.injector),
            {
              data: {
                item,
                mode: ActionWithDragon.Read,
              },
              dismissible: true,
              label: 'Dragon with gigachad killer',
            }
          )
        ),
        tuiTakeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  searchDragonsByName(
    searchQueryForm: PolymorpheusContent<TuiDialogContext>,
    dragonsTable: PolymorpheusContent<TuiDialogContext>
  ): void {
    this.dialogService
      .open(searchQueryForm, { label: 'Search' })
      .pipe(tuiTakeUntilDestroyed(this.destroyRef))
      .subscribe({
        complete: () => {
          const query = this.searchDragonByNameControl.value;
          if (!query) {
            return;
          }

          this.dragonService
            .searchDragonsByName$(query)
            .pipe(
              switchMap((dragons) => {
                this.foundDragonsByName.set(dragons);
                return this.dialogService.open(dragonsTable, {
                  label: 'Results',
                  size: 'auto',
                });
              }),
              tuiTakeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
        },
      });
  }

  showDragonInTheDeepestCave(): void {
    this.dragonService
      .getDragonInTheDeepestCave$()
      .pipe(
        switchMap((item) =>
          this.dialogService.open<{ item: Dragon; mode: ActionWithDragon }>(
            new PolymorpheusComponent(DragonFormComponent, this.injector),
            {
              data: {
                item,
                mode: ActionWithDragon.Read,
              },
              dismissible: true,
              label: 'Dragon in the deepest cave',
            }
          )
        ),
        tuiTakeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  createNewKillersGang(): void {
    this.dragonService
      .createDragonKillersGang$()
      .pipe(tuiTakeUntilDestroyed(this.destroyRef))
      .subscribe({
        complete: () => {
          this.alertService
            .open('New killers gang was created')
            .pipe(tuiTakeUntilDestroyed(this.destroyRef))
            .subscribe();
        },
        error: () => {
          this.alertService
            .open('Error when creating killers gang', { appearance: 'error' })
            .pipe(tuiTakeUntilDestroyed(this.destroyRef))
            .subscribe();
        },
      });
  }

  logout(): void {
    this.authService
      .logout()
      .pipe(tuiTakeUntilDestroyed(this.destroyRef))
      .subscribe({ complete: void this.router.navigate(['/login']) });
  }
}
