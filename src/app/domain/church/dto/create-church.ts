export type CreateChurchDTO = {
  phone: string;
  name: string;
  address_id?: string;
  facebook?: string | null;
  instagram?: string | null;
  youtube?: string | null;
  type_id: string;
};
