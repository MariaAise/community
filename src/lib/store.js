import { supabase } from './supabase';

export async function getRides(filter) {
  let query = supabase
    .from('rides')
    .select('*, profiles:user_id(name, area)')
    .order('created_at', { ascending: false });

  if (filter && filter !== 'all') {
    query = query.eq('type', filter);
  }

  const { data, error } = await query;
  if (error) throw error;

  return data.map(rowToRide);
}

export async function createRide(form, userId) {
  const { data, error } = await supabase
    .from('rides')
    .insert({
      user_id: userId,
      type: form.type,
      name: form.name,
      from_lat: form.from?.coords?.[0] ?? null,
      from_lng: form.from?.coords?.[1] ?? null,
      from_name: form.from?.name ?? null,
      to_lat: form.to?.coords?.[0] ?? null,
      to_lng: form.to?.coords?.[1] ?? null,
      to_name: form.to?.name ?? null,
      days: form.days,
      departure_time: form.departureTime || null,
      payment: form.payment,
      notice: form.notice,
      notes: form.notes || null,
    })
    .select()
    .single();

  if (error) throw error;
  return rowToRide(data);
}

export async function deleteRide(id) {
  const { error } = await supabase.from('rides').delete().eq('id', id);
  if (error) throw error;
}

export async function getRideCounts() {
  const { data, error } = await supabase.from('rides').select('type');
  if (error) throw error;
  return {
    offering: data.filter((r) => r.type === 'offering').length,
    need: data.filter((r) => r.type === 'need').length,
  };
}

function rowToRide(row) {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    name: row.profiles?.name || row.name,
    area: row.profiles?.area || null,
    from: row.from_name
      ? { coords: [row.from_lat, row.from_lng], name: row.from_name }
      : null,
    to: row.to_name
      ? { coords: [row.to_lat, row.to_lng], name: row.to_name }
      : null,
    days: row.days || [],
    departureTime: row.departure_time,
    payment: row.payment,
    notice: row.notice,
    notes: row.notes,
    createdAt: row.created_at,
  };
}
