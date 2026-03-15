import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useActivityFeed(tripId) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tripId) { setLoading(false); return; }
    setLoading(true);

    // Fetch last 50 activities with profile info
    supabase
      .from('activity_log')
      .select('*, profiles:user_id(id, name, email, avatar)')
      .eq('trip_id', tripId)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data, error: fetchErr }) => {
        if (fetchErr) setError(fetchErr.message);
        else setActivities(data ?? []);
        setLoading(false);
      });

    // Subscribe to realtime inserts for this trip
    const channel = supabase
      .channel(`activity-feed-${tripId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_log',
          filter: `trip_id=eq.${tripId}`,
        },
        async (payload) => {
          // Resolve profile for the new row
          const row = payload.new;
          if (row.user_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('id, name, email, avatar')
              .eq('id', row.user_id)
              .single();
            row.profiles = profile;
          }
          setActivities(prev => [row, ...prev]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tripId]);

  return { activities, loading, error };
}
