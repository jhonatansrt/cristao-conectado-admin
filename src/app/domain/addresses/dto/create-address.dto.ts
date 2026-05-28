export type CreateAddressDTO = {
  cep: string;
  number: string;
  street: string;
  district: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  place: string;
  churchId?: string;
  isMain?: boolean;
};
