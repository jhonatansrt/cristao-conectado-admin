export interface Pray {
  id: string;
  type: 1 | 2;
  title: string;
  description: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    avatar: string | null;
  };
}
