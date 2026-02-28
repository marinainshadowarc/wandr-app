import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useProfile() {
  const { session } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) return;
    // profiles.auth_id holds the auth.users id
    supabase
      .from('profiles')
      .select('*')
      .eq('auth_id', session.user.id)
      .single()
      .then(({ data }) => {
        setProfile(data);
        setLoading(false);
      });
  }, [session]);

  // profiles.name holds the display name
  const firstName = profile?.name?.split(' ')[0]
    ?? session?.user?.email?.split('@')[0]
    ?? 'Explorer';

  return { profile, firstName, loading };
}
