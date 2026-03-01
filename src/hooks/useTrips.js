import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase
      .from('trips')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setTrips(data ?? []);
        setLoading(false);
      });
  }, []);

  const addTrip = async ({ name, destination, start_date, end_date, cover_color }, profileId) => {
    const { data: trip, error: tripErr } = await supabase
      .from('trips')
      .insert({ name, destination, start_date, end_date, cover_color })
      .select()
      .single();
    if (tripErr) throw tripErr;

    const { error: memberErr } = await supabase
      .from('trip_members')
      .insert({ trip_id: trip.id, user_id: profileId, role: 'Owner' });
    if (memberErr) throw memberErr;

    setTrips(prev => [trip, ...prev]);
    return trip;
  };

  const deleteTrip = async (tripId) => {
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', tripId);
    if (error) throw error;
    setTrips(prev => prev.filter(t => t.id !== tripId));
  };

  return { trips, loading, error, addTrip, deleteTrip };
}
