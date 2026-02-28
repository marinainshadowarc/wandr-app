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

  return { trips, loading, error };
}
