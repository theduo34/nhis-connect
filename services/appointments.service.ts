import { supabase } from '@/config/supabase';
import type { AuthResult } from '@/interfaces/auth';

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  facilityName: string;
  facilityAddress: string | null;
  date: string;
  time: string;
  status: AppointmentStatus;
}

const APPOINTMENT_COLUMNS =
  'id, facility_name, facility_address, appointment_date, appointment_time, status';

function toAppointment(row: {
  id: string;
  facility_name: string;
  facility_address: string | null;
  appointment_date: string;
  appointment_time: string;
  status: string;
}): Appointment {
  return {
    id: row.id,
    facilityName: row.facility_name,
    facilityAddress: row.facility_address,
    date: row.appointment_date,
    time: row.appointment_time,
    status: row.status as AppointmentStatus,
  };
}

export async function fetchAppointments(userId: string): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select(APPOINTMENT_COLUMNS)
    .eq('user_id', userId)
    .order('appointment_date', { ascending: true });
  if (error || !data) return [];
  return data.map(toAppointment);
}

/** Admin home feed: most recently booked appointments across all subscribers. */
export async function fetchRecentAppointments(limit = 5): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select(APPOINTMENT_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data.map(toAppointment);
}

export interface NewAppointment {
  facilityId: string;
  facilityName: string;
  facilityAddress: string;
  date: string;
  time: string;
}

export async function createAppointment(
  userId: string,
  appointment: NewAppointment
): Promise<AuthResult> {
  const { error } = await supabase.from('appointments').insert({
    user_id: userId,
    facility_id: appointment.facilityId,
    facility_name: appointment.facilityName,
    facility_address: appointment.facilityAddress,
    appointment_date: appointment.date,
    appointment_time: appointment.time,
    status: 'upcoming',
  });
  if (error) return { error: error.message };
  return {};
}
