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
import { ITestimonialsRepository } from '../../domain/testimonials';
import { TestimonialsRepository } from '../testimonials/testimonials-repository';
import { IPrayRepository } from '../../domain/pray';
import { PrayRepository } from '../pray/pray-repository';
import { IRequestsRepository } from '../../domain/requests';
import { RequestsRepository } from '../requests/requests-repository';
import { IMembersRepository } from '../../domain/members';
import { MembersRepository } from '../members/members-repository';
import { IChurchRepository } from '../../domain/church';
import { ChurchRepository } from '../church/church-repository';
import { IPositionsRepository } from '../../domain/positions';
import { PositionsRepository } from '../positions/positions-repository';
import { IEbdClassRepository } from '../../domain/ebd/ebd-class.repository';
import { EbdClassRepository } from '../ebd/ebd-class-repository';
import { IEbdGroupRepository } from '../../domain/ebd/ebd-group.repository';
import { EbdGroupRepository } from '../ebd/ebd-group-repository';
import { IEbdTeacherRepository } from '../../domain/ebd/ebd-teacher.repository';
import { EbdTeacherRepository } from '../ebd/ebd-teacher-repository';
import { IEbdEnrollmentRepository } from '../../domain/ebd/ebd-enrollment.repository';
import { EbdEnrollmentRepository } from '../ebd/ebd-enrollment-repository';
import { IEbdLessonRepository } from '../../domain/ebd/ebd-lesson.repository';
import { EbdLessonRepository } from '../ebd/ebd-lesson-repository';

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

const testimonialsProvider = {
  provide: ITestimonialsRepository,
  useClass: TestimonialsRepository,
};

const prayProvider = {
  provide: IPrayRepository,
  useClass: PrayRepository,
};

const requestsProvider = {
  provide: IRequestsRepository,
  useClass: RequestsRepository,
};

const membersProvider = {
  provide: IMembersRepository,
  useClass: MembersRepository,
};

const churchProvider = {
  provide: IChurchRepository,
  useClass: ChurchRepository
}

const positionsProvider = {
  provide: IPositionsRepository,
  useClass: PositionsRepository,
};

const ebdClassProvider = {
  provide: IEbdClassRepository,
  useClass: EbdClassRepository,
};

const ebdGroupProvider = {
  provide: IEbdGroupRepository,
  useClass: EbdGroupRepository,
};

const ebdTeacherProvider = {
  provide: IEbdTeacherRepository,
  useClass: EbdTeacherRepository,
};

const ebdEnrollmentProvider = {
  provide: IEbdEnrollmentRepository,
  useClass: EbdEnrollmentRepository,
};

const ebdLessonProvider = {
  provide: IEbdLessonRepository,
  useClass: EbdLessonRepository,
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
  testimonialsProvider,
  prayProvider,
  requestsProvider,
  membersProvider,
  churchProvider,
  positionsProvider,
  ebdClassProvider,
  ebdGroupProvider,
  ebdTeacherProvider,
  ebdEnrollmentProvider,
  ebdLessonProvider,
];

export const providers = [...commonProviders];
