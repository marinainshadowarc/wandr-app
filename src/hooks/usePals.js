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

  /* ── helpers ── */

  async function resolveProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data: profile, error: pErr } = await supabase
      .from('profiles')
      .select('id, name')
      .eq('auth_id', user.id)
      .single();
    if (pErr || !profile) throw new Error('Profile not found');
    return profile;
  }

  /* ── invitePal ── */

  const invitePal = async (email, role, tripName) => {
    const { id: profileId, name: inviterName } = await resolveProfile();

    // Check if invited email already has a Wandr profile
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingProfile) {
      // Existing user — add directly to trip
      const { error: memberErr } = await supabase
        .from('trip_members')
        .upsert(
          { trip_id: tripId, user_id: existingProfile.id, role },
          { onConflict: 'trip_id,user_id' },
        );
      if (memberErr) throw memberErr;

      // Refresh local members list
      const { data: newMember } = await supabase
        .from('trip_members')
        .select('*')
        .eq('trip_id', tripId)
        .eq('user_id', existingProfile.id)
        .maybeSingle();

      if (newMember) {
        setMembers(prev => {
          if (prev.find(m => m.user_id === newMember.user_id)) return prev;
          return [...prev, { ...newMember, color: MEMBER_COLORS[prev.length % MEMBER_COLORS.length] }];
        });
      }

      return { existing: true };
    }

    // New user — check for existing pending invite (avoid duplicates)
    const { data: existingInvite } = await supabase
      .from('invitations')
      .select('*')
      .eq('trip_id', tripId)
      .eq('invited_email', email)
      .eq('status', 'pending')
      .maybeSingle();

    if (existingInvite) {
      const inviteLink = `${window.location.origin}?invite=${existingInvite.token}`;
      // Fire-and-forget: send email for the existing invite too
      sendInviteEmail(email, inviterName, tripName, inviteLink);
      return { existing: false, inviteLink, token: existingInvite.token };
    }

    // Create new invitation
    const token = crypto.randomUUID();
    const { error: insertErr } = await supabase
      .from('invitations')
      .insert({
        trip_id: tripId,
        invited_email: email,
        invited_by: profileId,
        role,
        token,
        status: 'pending',
      });
    if (insertErr) throw insertErr;

    const inviteLink = `${window.location.origin}?invite=${token}`;

    setPendingInvites(prev => [...prev, { invited_email: email, role, status: 'pending', token }]);

    // Fire-and-forget: send invite email via Edge Function
    sendInviteEmail(email, inviterName, tripName, inviteLink);

    return { existing: false, inviteLink, token };
  };

  const cancelInvite = async (inviteId) => {
    const { error: delErr } = await supabase
      .from('invitations')
      .delete()
      .eq('id', inviteId);
    if (delErr) throw delErr;
    setPendingInvites(prev => prev.filter(i => i.id !== inviteId));
  };

  return { members, pendingInvites, loading, error, invitePal, cancelInvite };
}

/* ── Send invite email via Edge Function (fire-and-forget) ── */

const INVITE_EMAIL_SECRET = 'wandr-invite-v1-s3cret';

async function sendInviteEmail(to, inviterName, tripName, inviteLink) {
  try {
    const res = await fetch(
      'https://vtnugabaxipgourmmkne.supabase.co/functions/v1/send-invite-email',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${INVITE_EMAIL_SECRET}`,
        },
        body: JSON.stringify({ to, inviterName, tripName, inviteLink }),
      },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn('Invite email failed:', res.status, err);
    }
  } catch (err) {
    // Email is best-effort — invite link still works without it
    console.warn('Invite email failed to send:', err.message);
  }
}

// Standalone function — called from App.jsx on invite link landing
export async function acceptInvitation(token) {
  // Resolve the current auth user's profile ID
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_id', user.id)
    .single();
  if (profileErr || !profile) throw new Error('Profile not found');

  const { data: inv, error: lookupErr } = await supabase
    .from('invitations')
    .select('*')
    .eq('token', token)
    .eq('status', 'pending')
    .maybeSingle();

  if (lookupErr || !inv) return null;

  // Add to trip_members using profile ID (not auth UID)
  const { error: memberErr } = await supabase
    .from('trip_members')
    .upsert({ trip_id: inv.trip_id, user_id: profile.id, role: inv.role }, { onConflict: 'trip_id,user_id' });

  if (memberErr) throw memberErr;

  // Mark invitation accepted
  await supabase.from('invitations').update({ status: 'accepted' }).eq('id', inv.id);

  return inv;
}
