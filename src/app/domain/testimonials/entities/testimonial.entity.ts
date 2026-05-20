export type Testimonial = {
  id: string;
  type: number;
  title: string;
  description: string;
  approved: boolean;
  created_at: string;
  churchId: string;
  user?: {
    id: string;
    name: string;
    avatar: string | null;
  };
};
