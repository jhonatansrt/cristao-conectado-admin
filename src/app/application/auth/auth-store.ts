import { inject, Injectable, signal } from '@angular/core';
import { User } from '../../domain/auth';
import { IStorageRepository } from '../../domain/storage';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private storage = inject(IStorageRepository);
  private userLogged = signal<User | undefined>(undefined);

  public getUserLogged() {
    return this.userLogged;
  }

  public async setUserLogged(user: User) {
    this.userLogged.set(user);
    await this.storage.setStorage('userLogged', user);
  }

  public clear() {
    this.userLogged.set(undefined);
  }
}
