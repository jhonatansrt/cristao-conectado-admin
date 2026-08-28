import { TypeUser } from "../../auth";
import { MaritalStatus } from "../../auth/enums/marital-status.enum";

export interface Member {
  id: string;
  is_active: boolean;
  is_baptized: boolean;
  user: {
    birth_date: string;
    marital_status: MaritalStatus;
    email: string;
    name: string;
    id: string;
    avatar?: string;
    type: TypeUser
  }
  memberPosition: {
    id: string;
    name?: string;
  } | null
}
