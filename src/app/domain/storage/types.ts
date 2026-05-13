import { User } from '../auth';

export type Types = {
  token: string;
  refreshToken: string;
  userLogged: User;
};

export type Key = keyof Types;

export type ObjectType<T extends Key> = Types[T] | undefined;

export type StoredObject<T extends Key> = {
  updatedDate: Date;
  object: ObjectType<T>;
};
