import { TypeUser } from '../enums/type-user.enum';

export type User = {
  id: string;
  name: string;
  email: string;
  birth_date: string;
  avatar: string;
  type: TypeUser;
  church_id?: string;
};
