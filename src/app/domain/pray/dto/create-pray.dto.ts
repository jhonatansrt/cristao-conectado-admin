export interface CreatePrayDTO {
  id?: string;
  churchId: string;
  type: 1 | 2;
  title: string;
  description: string;
}
