import { Observable } from 'rxjs';
import { CreateAccountDTO } from './dto/create-account.dto';
import { CreateSessionDTO } from './dto/create-session.dto';
import { CreateSessionApiResponse } from './dto/create-session-response.dto';
import { RefreshTokenDTO } from './dto/refresh-token.dto';
import { RefreshTokenApiResponse } from './dto/refresh-token-response.dto';
import { UpdateAvatarDTO } from './dto/update-avatar.dto';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

export abstract class IAuthRepository {
  abstract createSession(
    props: CreateSessionDTO,
  ): Observable<CreateSessionApiResponse>;

  abstract createAccount(props: CreateAccountDTO): Observable<void>;

  abstract refreshToken(
    props: RefreshTokenDTO,
  ): Observable<RefreshTokenApiResponse>;

  abstract updateUser(props: UpdateUserDTO): Observable<void>;

  abstract updatePassword(props: UpdatePasswordDTO): Observable<void>;

  abstract updateAvatar(props: UpdateAvatarDTO): Observable<void>;
}
