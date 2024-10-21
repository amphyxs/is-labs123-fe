import { Color, DragonCharacter, DragonType } from '../dragon';

export type DragonCreateDao = {
  id: null;
  name: string;
  coordinates: CoordinatesCreateDao;
  cave: DragonCaveCreateDao;
  killer: PersonCreateDao;
  age: number | null;
  color: Color;
  type: DragonType | null;
  character: DragonCharacter;
  head: DragonHeadCreateDao;
  canBeEditedByAdmin: boolean;
};

export type DragonGetDao = {
  id: number;
  creationDate: string;
  name: string;
  coordinates: CoordinatesGetDao;
  cave: DragonCaveGetDao;
  killer: PersonGetDao;
  age: number | null;
  color: Color;
  type: DragonType | null;
  character: DragonCharacter;
  head: DragonHeadGetDao;
  owner: OwnerGetDao;
  canBeEditedByAdmin: boolean;
};

export type DependencyCreateDao = {
  id: number;
};

export type CoordinatesCreateDao = CoordinatesGetDao;

export type DragonCaveCreateDao = DragonCaveGetDao;

export type PersonCreateDao = PersonGetDao | null;

export type DragonHeadCreateDao = DragonHeadGetDao;

export type LocationCreateDao = LocationGetDao;

export type PersonGetDao = {
  id: number;
  name: string;
  hairColor: Color | null;
  eyeColor: Color;
  location: LocationGetDao;
  birthday: string | null;
  height: number;
  passportID: string;
} | null;

export type DragonCaveGetDao = {
  id: number;
  numberOfTreasures: number | null;
};

export type CoordinatesGetDao = {
  id: number;
  x: number;
  y: number;
};

export type DragonHeadGetDao = {
  id: number;
  size: number;
};

export type LocationGetDao = {
  id: number;
  x: number;
  y: number;
  name: string;
} | null;

export type OwnerGetDao = {
  id: number;
  username: string;
};
