import { toSignal } from '@angular/core/rxjs-interop';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DRAGON_SERVICE } from '@dg-core/di/dragon-service';
import { Dragon, Owner } from '@dg-core/types/models/dragon';
import {
  TuiButton,
  TuiDataList,
  TuiDialogContext,
  TuiError,
  TuiLabel,
  TuiLoader,
  TuiTextfield,
} from '@taiga-ui/core';
import {
  TUI_VALIDATION_ERRORS,
  TuiCheckbox,
  TuiDataListWrapper,
  TuiFieldErrorPipe,
} from '@taiga-ui/kit';
import {
  TuiInputDateModule,
  TuiInputNumberModule,
  TuiSelectModule,
} from '@taiga-ui/legacy';
import { injectContext } from '@taiga-ui/polymorpheus';
import { AuthService } from '@dg-core/services/auth.service';
import { ActionWithDragon } from '@dg-core/types/action-with-dragon.types';
import { AsyncPipe } from '@angular/common';

export type DragonFormDialogContext = {
  mode: ActionWithDragon;
  item?: Dragon;
};

@Component({
  selector: 'app-dragon-form',
  standalone: true,
  imports: [
    TuiTextfield,
    ReactiveFormsModule,
    TuiLabel,
    TuiInputDateModule,
    TuiSelectModule,
    TuiDataListWrapper,
    TuiDataList,
    TuiButton,
    TuiLoader,
    TuiError,
    TuiFieldErrorPipe,
    AsyncPipe,
    TuiInputNumberModule,
    TuiCheckbox,
  ],
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: {
        minlength: ({ requiredLength }: { requiredLength: string }): string =>
          `At least ${requiredLength} characters`,
        required: 'Required',
        min: 'Should be bigger than 0',
      },
    },
  ],
  templateUrl: './dragon-form.component.html',
  styleUrl: './dragon-form.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragonFormComponent {
  protected readonly context =
    injectContext<TuiDialogContext<void, DragonFormDialogContext>>();
  protected readonly fb = inject(FormBuilder);
  protected readonly dragonService = inject(DRAGON_SERVICE);
  protected readonly authService = inject(AuthService);

  dragonForm?: FormGroup;

  people = toSignal(this.dragonService.getPeopleList$());
  dragonCaves = toSignal(this.dragonService.getDragonCavesList$());
  coordinates = toSignal(this.dragonService.getCoordinatesList$());
  dragonHeads = toSignal(this.dragonService.getDragonHeadsList$());
  isLoading = signal(true);

  get isEditable(): boolean {
    return [ActionWithDragon.Update, ActionWithDragon.Create].includes(
      this.context.data.mode
    );
  }

  constructor() {
    effect(
      () => {
        const dependencies = {
          coordinates: this.coordinates()!,
          caves: this.dragonCaves()!,
          heads: this.dragonHeads()!,
          people: this.people()!,
          owner: this.authService.currentUser!,
        };

        if (Object.values(dependencies).some((dependency) => !dependency)) {
          return;
        }

        const dragon: Dragon =
          this.context.data.item ?? Dragon.createBlank(dependencies);

        this.dragonForm = this.fb.group({
          id: [dragon.id], // Assuming default id starts from 0
          name: [dragon.name, [Validators.required, Validators.minLength(1)]], // Dragon name is required
          coordinates: this.fb.group({
            existing: [dragon.coordinates],
            x: [dragon.coordinates.x, Validators.required], // X and Y coordinates
            y: [dragon.coordinates.y, Validators.required],
          }),
          creationDate: [dragon.creationDate, Validators.required], // Default to current date
          cave: this.fb.group({
            existing: [dragon.cave],
            numberOfTreasures: [dragon.cave.numberOfTreasures], // Optional field for treasures
          }),
          killer: this.fb.group({
            existing: [dragon.killer],
            name: [dragon.killer?.name], // Optional Person
            eyeColor: [dragon.killer?.eyeColor],
            hairColor: [dragon.killer?.hairColor],
            location: this.fb.group({
              x: [dragon.killer?.location?.x],
              y: [dragon.killer?.location?.y],
              name: [dragon.killer?.location?.name],
            }),
            birthday: [dragon?.killer?.birthday],
            height: [dragon.killer?.height],
            passportId: [dragon.killer?.passportId],
          }),
          age: [dragon.age, Validators.min(0)], // Optional age
          color: [dragon.color, Validators.required], // Default color, can be customized
          type: [dragon.type], // Optional type
          character: [dragon.character, Validators.required], // Character is required
          head: this.fb.group({
            existing: [dragon.head],
            size: [dragon.head.size, Validators.required], // Head size, required field
          }),
          canBeEditedByAdmin: [false],
        });

        if (this.context.data.mode === ActionWithDragon.Read) {
          this.dragonForm.disable();
        } else {
          this.dragonForm.markAllAsTouched();
        }

        this.isLoading.set(false);
      },
      { allowSignalWrites: true }
    );
  }

  save(): void {
    const formValues = this.dragonForm!.value;
    const owner = new Owner(this.authService.currentUser!.username, null);
    const dragon: Dragon = new Dragon(
      formValues.name,
      formValues.coordinates.existing,
      formValues.cave.existing,
      formValues.color,
      formValues.character,
      formValues.head.existing,
      parseInt(formValues.age),
      formValues.type,
      formValues.killer.existing,
      owner,
      formValues.canBeEditedByAdmin,
      null,
      new Date()
    );

    switch (this.context.data.mode) {
      case ActionWithDragon.Create:
        this.dragonService.createDragon$(dragon).subscribe({
          complete: () => this.context.completeWith(),
        });
        break;
      case ActionWithDragon.Update:
        dragon.id = formValues.id;
        this.dragonService.updateDragon$(dragon).subscribe({
          complete: () => this.context.completeWith(),
        });
        break;
    }
  }

  cancel(): void {
    this.context.completeWith();
  }
}
