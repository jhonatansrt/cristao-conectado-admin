export interface Pray {
  id: string;
  type: 1 | 2;
  title: string;
  description: string;
  created_at: string;
  church_id: string;
  user?: {
    id: string;
    name: string;
    avatar: string | null;
  };
  __user__?: {
    id: string;
    name: string;
    avatar: string | null;
  };
}
