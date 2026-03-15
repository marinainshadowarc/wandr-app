import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { logActivity } from '../lib/activityLogger';

const TYPE_LABELS = {
  flight:    'Flights',
  hotel:     'Accommodation',
  food:      'Food',
  activity:  'Activities',
  transport: 'Transport',
};
const TYPE_COLORS = {
  flight:    '#6366f1',
  hotel:     '#ff6b4a',
  food:      '#f59e0b',
  activity:  '#10b981',
  transport: '#a855f7',
};

export function useBudget(tripId) {
  const [tripData, setTripData] = useState(null);
  const [items,    setItems]    = useState([]);
  const [members,  setMembers]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    if (!tripId) { setLoading(false); return; }
    setLoading(true);

    Promise.all([
      supabase.from('trips').select('id, total_budget').eq('id', tripId).single(),
      supabase.from('itinerary_items').select('*').eq('trip_id', tripId),
      supabase.from('trip_members').select('*').eq('trip_id', tripId),
    ]).then(async ([tripRes, itemsRes, membersRes]) => {
      if (tripRes.error) { setError(tripRes.error.message); setLoading(false); return; }

      // Resolve member profiles
      const memberData = membersRes.data ?? [];
      const userIds = memberData.map(m => m.user_id).filter(Boolean);
      let profileMap = {};
      if (userIds.length > 0) {
        const { data: profileData } = await supabase
          .from('profiles').select('id, name, email').in('id', userIds);
        (profileData ?? []).forEach(p => { profileMap[p.id] = p; });
      }

      setTripData(tripRes.data);
      setItems(itemsRes.data ?? []);
      setMembers(memberData.map(m => ({ ...m, profile: profileMap[m.user_id] ?? null })));
      setLoading(false);
    }).catch(err => {
      setError(err.message ?? 'Failed to load budget.');
      setLoading(false);
    });
  }, [tripId]);

  const updateTotalBudget = async (amount) => {
    const { data, error: err } = await supabase
      .from('trips')
      .update({ total_budget: Number(amount) })
      .eq('id', tripId)
      .select('total_budget')
      .single();
    if (err) throw err;
    setTripData(prev => ({ ...prev, total_budget: data.total_budget }));
    logActivity(tripId, `updated_budget:$${amount}`, 'budget');
  };

  // ── Derived values ────────────────────────────────────────
  const totalBudget = Number(tripData?.total_budget ?? 0);
  const totalSpent  = items.reduce((s, i) => s + Number(i.cost ?? 0), 0);
  const remaining   = totalBudget - totalSpent;
  const pct         = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 999) : 0;

  // Category breakdown grouped by type
  const catMap = {};
  items.forEach(item => {
    const key = item.type ?? 'other';
    if (!catMap[key]) catMap[key] = { type: key, label: TYPE_LABELS[key] ?? key, total: 0 };
    catMap[key].total += Number(item.cost ?? 0);
  });
  const categories = Object.values(catMap)
    .filter(c => c.total > 0)
    .sort((a, b) => b.total - a.total)
    .map(c => ({
      ...c,
      color:    TYPE_COLORS[c.type] ?? '#6366f1',
      sharePct: totalSpent > 0 ? Math.round((c.total / totalSpent) * 100) : 0,
    }));

  // Per person
  const memberCount = members.length;
  const perPerson   = memberCount > 0 ? totalSpent / memberCount : 0;

  return {
    totalBudget, totalSpent, remaining, pct,
    categories, members, memberCount, perPerson,
    loading, error,
    hasItems:  items.length > 0,
    hasBudget: totalBudget > 0,
    updateTotalBudget,
  };
}
