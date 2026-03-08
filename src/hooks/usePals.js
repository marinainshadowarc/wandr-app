import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const MEMBER_COLORS = ['#c9a96e', '#a0856a', '#7a9e9f', '#b07d62', '#8b9e8b', '#c4a882'];

export function usePals(tripId) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tripId) { setLoading(false); return; }
    setLoading(true);

    supabase
      .from('trip_members')
      .select('*')
      .eq('trip_id', tripId)
      .then(async ({ data: memberData, error: memberErr }) => {
        if (memberErr) { setError(memberErr.message); setLoading(false); return; }

        const userIds = (memberData ?? []).map(m => m.user_id).filter(Boolean);

        let profileMap = {};
        if (userIds.length > 0) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, name, email, avatar')
            .in('id', userIds);
          (profileData ?? []).forEach(p => { profileMap[p.id] = p; });
        }

        const merged = (memberData ?? []).map((m, i) => ({
          ...m,
          profile: profileMap[m.user_id] ?? null,
          color: MEMBER_COLORS[i % MEMBER_COLORS.length],
        }));

        setMembers(merged);
        setLoading(false);
      });
  }, [tripId]);

  // No activity_feed table in this schema
  return { members, loading, error };
}
