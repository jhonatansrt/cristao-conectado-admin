export type CreateScheduleDTO = {
  addressId: string;
  title: string;
  description: string;
  churchId: string;
  hourInitial: number;
  hourFinal: number;
  day?: number;
  scheduleDate?: string;
};
