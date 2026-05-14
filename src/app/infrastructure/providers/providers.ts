import { IStorageRepository } from '../../domain/storage';
import { StorageRepository } from '../storage/storage-repository';
import { IAuthRepository } from '../../domain/auth';
import { AuthRepository } from '../auth/auth-repository';
import { INoticesRepository } from '../../domain/notices';
import { NoticesRepository } from '../notices/notices-repository';

const storageProvider = {
  provide: IStorageRepository,
  useClass: StorageRepository,
};

const authProvider = {
  provide: IAuthRepository,
  useClass: AuthRepository,
};

const noticesProvider = {
  provide: INoticesRepository,
  useClass: NoticesRepository,
};

const commonProviders = [storageProvider, authProvider, noticesProvider];

export const providers = [...commonProviders];
