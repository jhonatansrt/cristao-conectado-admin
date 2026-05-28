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

  public async updateChurchId(churchId: string) {
    const currentUser = this.userLogged();

    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      church_id: churchId,
    };

    this.userLogged.set(updatedUser);

    await this.storage.setStorage('userLogged', updatedUser);
  }
}
