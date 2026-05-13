import { ObjectType, Key } from './types';

export abstract class IStorageRepository {
  public abstract getStorage<T extends Key>(
    key: T,
  ): Promise<ObjectType<T> | null>;

  public abstract setStorage<T extends Key>(
    key: T,
    data: ObjectType<T>,
  ): Promise<void>;

  public abstract deleteFromStorage(key: Key): Promise<void>;

  public abstract clearAll(): Promise<void>;
}
