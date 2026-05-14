export type Notice = {
  id: string;
  type: number;
  title: string;
  description: string;
  approved: boolean;
  created_at: string;
  name: string;
  avatar: string | null;
  churchId: string;
};
