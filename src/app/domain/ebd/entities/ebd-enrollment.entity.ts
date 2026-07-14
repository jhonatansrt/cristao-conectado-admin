export type EbdEnrollmentStatus = 'ACTIVE' | 'CANCELLED';

export type EbdEnrollmentType = 'MAIN' | 'COMPLEMENTARY';

export interface EbdEnrollment {
  id: string;
  user_id: string;
  group_id: string;
  responsible_member_id: string | null;
  enrollment_date: string;
  status: EbdEnrollmentStatus;
  type: EbdEnrollmentType;
  school_year: number;
  church_id: string;
  name: string;
  responsible_name: string | null;
}
