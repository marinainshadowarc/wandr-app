import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const MEMBER_COLORS = ['#6366f1', '#ff6b4a', '#10b981', '#f59e0b', '#a855f7', '#06b6d4'];

export function usePals(tripId) {
  const [members,        setMembers]        = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);

  useEffect(() => {
    if (!tripId) { setLoading(false); return; }
    setLoading(true);

    Promise.all([
      supabase.from('trip_members').select('*').eq('trip_id', tripId),
      supabase.from('invitations').select('*').eq('trip_id', tripId).eq('status', 'pending'),
    ]).then(async ([{ data: memberData, error: memberErr }, { data: inviteData }]) => {
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
      setPendingInvites(inviteData ?? []);
      setLoading(false);
    }).catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, [tripId]);

  const invitePal = async (email, role) => {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error: fnErr } = await supabase.functions.invoke('invite-pal', {
      body: {
        trip_id:    tripId,
        email,
        role,
        invited_by: user?.id,
      },
    });

    if (fnErr) throw fnErr;
    if (data?.error) throw new Error(data.error);

    // If the user already existed, they're now a member — refresh
    if (data?.existing) {
      const { data: newMember } = await supabase
        .from('trip_members')
        .select('*')
        .eq('trip_id', tripId)
        .eq('user_id', (await supabase.from('profiles').select('id').eq('email', email).single()).data?.id)
        .maybeSingle();

      if (newMember) {
        setMembers(prev => {
          const already = prev.find(m => m.user_id === newMember.user_id);
          if (already) return prev;
          return [...prev, { ...newMember, color: MEMBER_COLORS[prev.length % MEMBER_COLORS.length] }];
        });
      }
    } else {
      // Pending invite created — add to pendingInvites list
      setPendingInvites(prev => [...prev, { invited_email: email, role, status: 'pending' }]);
    }

    return data;
  };

  return { members, pendingInvites, loading, error, invitePal };
}

// Standalone function — called from App.jsx on invite link landing
export async function acceptInvitation(token, userId) {
  const { data: inv, error: lookupErr } = await supabase
    .from('invitations')
    .select('*')
    .eq('token', token)
    .eq('status', 'pending')
    .maybeSingle();

  if (lookupErr || !inv) return null;

  // Add to trip_members
  const { error: memberErr } = await supabase
    .from('trip_members')
    .upsert({ trip_id: inv.trip_id, user_id: userId, role: inv.role }, { onConflict: 'trip_id,user_id' });

  if (memberErr) throw memberErr;

  // Mark invitation accepted
  await supabase.from('invitations').update({ status: 'accepted' }).eq('id', inv.id);

  return inv;
}
