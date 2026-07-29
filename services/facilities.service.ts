import { supabase } from '@/config/supabase';

export interface Facility {
  id: string;
  name: string;
  address: string;
  region: string;
  type: string;
}

export async function fetchFacilities(): Promise<Facility[]> {
  const { data, error } = await supabase
    .from('facilities')
    .select('id, name, address, region, type')
    .order('name', { ascending: true });
  if (error || !data) return [];
  return data;
}
