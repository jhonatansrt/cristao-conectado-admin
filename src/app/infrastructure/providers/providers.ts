import { IStorageRepository } from '../../domain/storage';
import { StorageRepository } from '../storage/storage-repository';
import { IAuthRepository } from '../../domain/auth';
import { AuthRepository } from '../auth/auth-repository';
import { INoticesRepository } from '../../domain/notices';
import { NoticesRepository } from '../notices/notices-repository';
import { ISchedulesRepository } from '../../domain/schedules';
import { SchedulesRepository } from '../schedules/schedules-repository';
import { IPlaylistsRepository } from '../../domain/playlists';
import { PlaylistsRepository } from '../playlists/playlists-repository';
import { IVideosRepository } from '../../domain/videos';
import { VideosRepository } from '../videos/videos-repository';
import { IGoogleMapsRepository } from '../../domain/google-maps';
import { GoogleMapsRepository } from '../google-maps/google-maps-repository';
import { IAddressesRepository } from '../../domain/addresses';
import { AddressesRepository } from '../addresses/addresses-repository';

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

const schedulesProvider = {
  provide: ISchedulesRepository,
  useClass: SchedulesRepository,
};

const playlistsProvider = {
  provide: IPlaylistsRepository,
  useClass: PlaylistsRepository,
};

const videosProvider = {
  provide: IVideosRepository,
  useClass: VideosRepository,
};

const googleMapsProvider = {
  provide: IGoogleMapsRepository,
  useClass: GoogleMapsRepository,
};

const addressesProvider = {
  provide: IAddressesRepository,
  useClass: AddressesRepository,
};

const commonProviders = [
  storageProvider,
  authProvider,
  noticesProvider,
  schedulesProvider,
  playlistsProvider,
  videosProvider,
  googleMapsProvider,
  addressesProvider,
];

export const providers = [...commonProviders];
