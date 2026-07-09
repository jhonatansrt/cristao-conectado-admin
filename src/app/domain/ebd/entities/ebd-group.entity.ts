export type EbdGroupType = 'MAIN' | 'COMPLEMENTARY';

export interface EbdGroup {
  id: string;
  church_id: string;
  name: string;
  type: EbdGroupType;
  school_year: number;
  student_limit?: number;
  class_id: string;
  teacher_id: string;
}
