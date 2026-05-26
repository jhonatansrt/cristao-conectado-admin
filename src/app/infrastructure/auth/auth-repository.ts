import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateAccountDTO,
  CreateSessionApiResponse,
  CreateSessionDTO,
  ForgotPasswordDTO,
  IAuthRepository,
  ResetPasswordDTO,
  UpdateAvatarApiResponse,
  UpdateAvatarDTO,
  UpdatePasswordDTO,
  UpdateUserDTO,
} from '../../domain/auth';
import { RefreshTokenDTO } from '../../domain/auth/dto/refresh-token.dto';
import { RefreshTokenApiResponse } from '../../domain/auth/dto/refresh-token-response.dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthRepository implements IAuthRepository {
  constructor(private httpClient: HttpClient) {}
  public createSession(props: CreateSessionDTO): Observable<CreateSessionApiResponse> {
    const url = environment.apiBaseURL + '/sessions';
    return this.httpClient.post<CreateSessionApiResponse>(url, props);
  }

  public createAccount(props: CreateAccountDTO): Observable<void> {
    const url = environment.apiBaseURL + '/users';
    return this.httpClient.post<void>(url, props);
  }

  public refreshToken(props: RefreshTokenDTO): Observable<RefreshTokenApiResponse> {
    const url = environment.apiBaseURL + '/refresh-token';
    return this.httpClient.post<RefreshTokenApiResponse>(url, props);
  }

  public updateUser(props: UpdateUserDTO): Observable<void> {
    const url = environment.apiBaseURL + '/users';
    return this.httpClient.put<void>(url, props);
  }

  public updatePassword(props: UpdatePasswordDTO): Observable<void> {
    const url = environment.apiBaseURL + '/users/password';
    return this.httpClient.patch<void>(url, props);
  }

  public updateAvatar(props: UpdateAvatarDTO): Observable<UpdateAvatarApiResponse> {
    const url = environment.apiBaseURL + '/users/avatar';
    const formData = new FormData();
    formData.append('avatar', props.file);
    return this.httpClient.patch<UpdateAvatarApiResponse>(url, formData);
  }

  public forgotPassword(props: ForgotPasswordDTO): Observable<void> {
    const url = environment.apiBaseURL + '/password/forgot';
    return this.httpClient.post<void>(url, { email: props.email });
  }

  public resetPassword(props: ResetPasswordDTO): Observable<void> {
    const url = environment.apiBaseURL + '/password/reset';
    return this.httpClient.post<void>(url, { password: props.password }, {
      params: { token: props.token },
    });
  }
}
