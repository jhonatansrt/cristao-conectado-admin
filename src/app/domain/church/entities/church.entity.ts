export type Church = {
  id: string;
  phone: string;
  name: string;
  address_id: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  type_id: string;

  type: {
    id: string,
    name: string,
  }

  address: {
    id: string;
    place: string;
    cep: string;
    number: string;
    street: string;
    district: string;
    city: string;
    state: string;
    latitude: string;
    longitude: string;
  }
};
