import { Injectable } from '@angular/core';
import { IStorageRepository, Key, ObjectType, StoredObject } from '../../domain/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageRepository implements IStorageRepository {
  public async getStorage<T extends Key>(key: T): Promise<ObjectType<T> | null> {
    const value = localStorage.getItem(key);

    if (!value) {
      return null;
    }

    const parsedObject: StoredObject<T> = JSON.parse(value);
    return parsedObject.object;
  }

  public async setStorage<T extends Key>(key: T, data: ObjectType<T>): Promise<void> {
    const storedObject: StoredObject<T> = {
      updatedDate: new Date(),
      object: data,
    };

    localStorage.setItem(key, JSON.stringify(storedObject));
  }

  public async deleteFromStorage(key: Key): Promise<void> {
    localStorage.removeItem(key);
  }

  public async clearAll(): Promise<void> {
    localStorage.clear();
  }
}
