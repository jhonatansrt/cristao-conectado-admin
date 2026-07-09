import { EbdGroupType } from '../entities/ebd-group.entity';

export interface CreateEbdGroupDTO {
  church_id: string;
  name: string;
  type: EbdGroupType;
  school_year: number;
  student_limit?: number;
  class_id: string;
  teacher_id: string;
}
