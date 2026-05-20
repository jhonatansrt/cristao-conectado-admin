export type Testimonial = {
  id: string;
  type: number;
  title: string;
  description: string;
  approved: boolean;
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
};
