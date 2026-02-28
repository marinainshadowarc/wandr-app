import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Postgres time type returns '08:00:00' — trim to 'HH:MM'
const fmtTime = t => (t ? t.slice(0, 5) : '');

export function useItinerary(tripId) {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tripId) return;
    setLoading(true);
    supabase
      .from('itinerary_items')
      .select('*')
      .eq('trip_id', tripId)
      .order('day_number', { ascending: true })
      .order('time', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
        } else {
          // Group into { day, items[] } — no day_date column exists
          const grouped = [];
          (data ?? []).forEach(row => {
            let group = grouped.find(g => g.day === row.day_number);
            if (!group) {
              group = { day: row.day_number, items: [] };
              grouped.push(group);
            }
            group.items.push({ ...row, time: fmtTime(row.time) });
          });
          setDays(grouped);
        }
        setLoading(false);
      });
  }, [tripId]);

  return { days, loading, error };
}
