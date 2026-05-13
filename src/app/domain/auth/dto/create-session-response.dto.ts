import { User } from '../entities/user.entity';

export type CreateSessionApiResponse = {
  user: User;
  token: string;
  refresh_token: string;
};
