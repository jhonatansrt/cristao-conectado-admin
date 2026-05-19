export type ScheduleAttendance = {
  name: string;
  avatar: string | null;
};

export type ScheduleDetails = {
  address_id: string;
  schedule_id: string;
  place: string;
  cep: string;
  number: string;
  street: string;
  district: string;
  city: string;
  state: string;
  latitude: string;
  longitude: string;
  attendances: ScheduleAttendance[];
  church_id: string;
  schedule_date: string | null;
  description: string;
};
