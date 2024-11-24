import { Model } from './model';
import {
  CoordinatesCreateDto,
  CoordinatesGetDto,
  DragonCaveCreateDto,
  DragonCaveGetDto,
  DragonCreateDto,
  DragonGetDto,
  DragonHeadCreateDto,
  DragonHeadGetDto,
  LocationCreateDto,
  LocationGetDto,
  OwnerGetDto,
  PersonCreateDto,
  PersonGetDto,
} from './dtos/dragon.dtos';
import { User } from './user';

export class Dragon extends Model {
  constructor(
    public name: string,
    public coordinates: Coordinates,
    public cave: DragonCave,
    public color: Color,
    public character: DragonCharacter,
    public head: DragonHead,
    public age: number | null,
    public type: DragonType | null,
    public killer: Person | null,
    public owner: Owner,
    public canBeEditedByAdmin: boolean,
    override id: number | null,
    override creationDate: Date
  ) {
    super(id, creationDate);
  }

  override asCreateDao(): DragonCreateDto {
    return {
      id: null,
      name: this.name,
      coordinates: this.coordinates.asCreateDao(),
      cave: this.cave.asCreateDao(),
      color: this.color.toUpperCase() as Color,
      character: this.character.toUpperCase() as DragonCharacter,
      head: this.head.asCreateDao(),
      age: this.age ?? null,
      type: (this.type?.toUpperCase() as DragonType) ?? null,
      killer: this.killer?.asCreateDao() ?? null,
      canBeEditedByAdmin: this.canBeEditedByAdmin,
    };
  }

  static createBlank(dependencies: {
    coordinates: Coordinates[];
    caves: DragonCave[];
    heads: DragonHead[];
    people: Person[];
    owner: User;
  }): Dragon {
    return new Dragon(
      '',
      dependencies.coordinates[0],
      dependencies.caves[0],
      Color.Black,
      DragonCharacter.Cunning,
      dependencies.heads[0],
      null,
      null,
      null,
      new Owner(dependencies.owner.username),
      false,
      null,
      new Date()
    );
  }

  static override fromGetDao(dao: DragonGetDto): Dragon {
    return new Dragon(
      dao.name,
      Coordinates.fromGetDao!(dao.coordinates) as Coordinates,
      DragonCave.fromGetDao!(dao.cave) as DragonCave,
      dao.color,
      dao.character,
      DragonHead.fromGetDao!(dao.head) as DragonHead,
      dao.age,
      dao.type,
      Person.fromGetDao!(dao.killer) as Person | null,
      Owner.fromGetDao!(dao.owner) as Owner,
      dao.canBeEditedByAdmin,
      dao.id,
      new Date(dao.creationDate)
    );
  }
}

export class DragonHead extends Model {
  constructor(public size: number, override id: number | null) {
    super();
  }

  override asCreateDao(): DragonHeadCreateDto {
    return {
      id: this.id!,
      size: this.size,
    };
  }

  static override fromGetDao(dao: DragonHeadGetDto): DragonHead {
    return new DragonHead(dao.size, dao.id);
  }

  override toString(): string {
    return this.size.toFixed(2);
  }
}

export class Coordinates extends Model {
  constructor(public x: number, public y: number, override id: number | null) {
    super();
  }

  override asCreateDao(): CoordinatesCreateDto {
    return {
      id: this.id!,
      x: this.x,
      y: this.y,
    };
  }

  static override fromGetDao(dao: CoordinatesGetDto): Coordinates {
    return new Coordinates(dao.x, dao.y, dao.id);
  }

  override toString(): string {
    return `(${this.x.toFixed(2)}; ${this.y})`;
  }
}

export class DragonCave extends Model {
  constructor(
    public numberOfTreasures: number | null,
    override id: number | null
  ) {
    super();
  }

  override asCreateDao(): DragonCaveCreateDto {
    return {
      id: this.id!,
      numberOfTreasures: this.numberOfTreasures,
    };
  }

  static override fromGetDao(dao: DragonCaveGetDto): DragonCave {
    return new DragonCave(dao.numberOfTreasures, dao.id);
  }

  override toString(): string {
    return this.numberOfTreasures?.toString() ?? 'Empty cave';
  }
}

export class Person extends Model {
  constructor(
    public name: string,
    public eyeColor: Color,
    public hairColor: Color | null,
    public location: Location | null,
    public birthday: Date | null,
    public height: number,
    public passportId: string,
    override id: number | null
  ) {
    super();
  }

  override asCreateDao(): PersonCreateDto {
    return {
      id: this.id!,
      birthday: this.birthday?.toISOString() ?? null,
      eyeColor: this.eyeColor.toUpperCase() as Color,
      hairColor: (this.hairColor?.toUpperCase() as Color) ?? null,
      height: this.height,
      location: (this.location?.asCreateDao!() as LocationCreateDto) ?? null,
      name: this.name,
      passportID: this.passportId,
    };
  }

  static override fromGetDao(dao: PersonGetDto | null): Person | null {
    return dao
      ? new Person(
          dao.name,
          dao.eyeColor,
          dao.hairColor,
          Location.fromGetDao!(dao.location) as Location,
          dao.birthday ? new Date(dao.birthday) : null,
          dao.height,
          dao.passportID,
          dao.id
        )
      : null;
  }

  override toString(): string {
    return `${this.name} of ${this.location?.name ?? '???'}`;
  }
}

export class Location extends Model {
  constructor(
    public x: number,
    public y: number,
    public name: string,
    override id: number | null
  ) {
    super();
  }

  static override fromGetDao(dao: LocationGetDto): Location | null {
    return dao ? new Location(dao.x, dao.y, dao.name, dao.id) : null;
  }

  override toString(): string {
    return `${this.name} (${this.x}; ${this.y})`;
  }
}

export enum Color {
  Green = 'GREEN',
  Black = 'BLACK',
  Blue = 'BLUE',
  Yellow = 'YELLOW',
  Brown = 'BROWN',
}

export enum DragonType {
  Underground = 'UNDEGROUND',
  Air = 'AIR',
  Fire = 'FIRE',
}

export enum DragonCharacter {
  Cunning = 'CUNNING',
  Wise = 'WISE',
  Evil = 'EVIL',
  Fickle = 'FICKLE',
}

export class Owner extends Model {
  constructor(public username: string) {
    super();
  }

  static override fromGetDao(dao: OwnerGetDto): Owner {
    return new Owner(dao.username);
  }

  override toString(): string {
    return this.username;
  }
}
