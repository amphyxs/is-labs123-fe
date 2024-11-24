import { Color, DragonCharacter, DragonType } from '../dragon';

export type DragonCreateDto = {
  id: null;
  name: string;
  coordinates: CoordinatesCreateDto;
  cave: DragonCaveCreateDto;
  killer: PersonCreateDto;
  age: number | null;
  color: Color;
  type: DragonType | null;
  character: DragonCharacter;
  head: DragonHeadCreateDto;
  canBeEditedByAdmin: boolean;
};

export type DragonGetDto = {
  id: number;
  creationDate: string;
  name: string;
  coordinates: CoordinatesGetDto;
  cave: DragonCaveGetDto;
  killer: PersonGetDto;
  age: number | null;
  color: Color;
  type: DragonType | null;
  character: DragonCharacter;
  head: DragonHeadGetDto;
  owner: OwnerGetDto;
  canBeEditedByAdmin: boolean;
};

export type DependencyCreateDto = {
  id: number;
};

export type CoordinatesCreateDto = CoordinatesGetDto;

export type DragonCaveCreateDto = DragonCaveGetDto;

export type PersonCreateDto = PersonGetDto | null;

export type DragonHeadCreateDto = DragonHeadGetDto;

export type LocationCreateDto = LocationGetDto;

export type PersonGetDto = {
  id: number;
  name: string;
  hairColor: Color | null;
  eyeColor: Color;
  location: LocationGetDto;
  birthday: string | null;
  height: number;
  passportID: string;
} | null;

export type DragonCaveGetDto = {
  id: number;
  numberOfTreasures: number | null;
};

export type CoordinatesGetDto = {
  id: number;
  x: number;
  y: number;
};

export type DragonHeadGetDto = {
  id: number;
  size: number;
};

export type LocationGetDto = {
  id: number;
  x: number;
  y: number;
  name: string;
} | null;

export type OwnerGetDto = {
  id: number;
  username: string;
};
