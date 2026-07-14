export type EbdGroupType = 'MAIN' | 'COMPLEMENTARY';

export type EbdGroupStatus = 'ACTIVE' | 'CLOSED';

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

export interface EbdGroupListItem {
  id: string;
  series_id: string;
  name: string;
  type: EbdGroupType;
  school_year: number;
  status: EbdGroupStatus;
  closed_at: string | null;
  student_limit: number | null;
  class_id: string;
  class_name: string;
  teacher_id: string;
  teacher_name: string;
  church_id: string;
}
