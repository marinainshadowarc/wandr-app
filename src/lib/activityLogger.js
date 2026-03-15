import { supabase } from './supabase';

let cachedProfileId = null;

async function resolveProfileId() {
  if (cachedProfileId) return cachedProfileId;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_id', user.id)
    .single();
  if (profile) cachedProfileId = profile.id;
  return cachedProfileId;
}

export function clearProfileCache() {
  cachedProfileId = null;
}

export function logActivity(tripId, action, category, userId) {
  // Fire-and-forget — callers don't await this
  (async () => {
    try {
      const profileId = userId ?? await resolveProfileId();
      if (!profileId) return;
      await supabase.from('activity_log').insert({
        trip_id: tripId,
        user_id: profileId,
        action,
        category,
      });
    } catch (err) {
      console.warn('Activity log failed:', err.message);
    }
  })();
}
