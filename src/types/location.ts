import { User } from './user';

export enum LocationType {
  PROVINCE = 'PROVINCE',
  DISTRICT = 'DISTRICT',
  SECTOR = 'SECTOR',
  CELL = 'CELL',
  VILLAGE = 'VILLAGE',
}

export interface Location {
  id: number;
  name: string;
  code: string;
  type: LocationType;
  parent?: Location;
  children?: Location[];
  users?: User[];
}

