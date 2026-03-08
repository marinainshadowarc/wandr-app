import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const CATEGORY_COLORS = {
  Flights:       '#c9a96e',
  Accommodation: '#a0856a',
  Food:          '#7a9e9f',
  Activities:    '#b07d62',
  Transport:     '#8b9e8b',
  Shopping:      '#c4a882',
  Other:         '#b0a090',
};

const colorForCategory = (name, idx) =>
  CATEGORY_COLORS[name] ?? ['#c9a96e','#a0856a','#7a9e9f','#b07d62','#8b9e8b','#c4a882'][idx % 6];

export function useBudget(tripId) {
  const [rows,    setRows]    = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!tripId) return;
    setLoading(true);

    Promise.all([
      supabase.from('budget').select('*').eq('trip_id', tripId).order('created_at', { ascending: false }),
      supabase.from('trip_members').select('*').eq('trip_id', tripId),
    ]).then(async ([budgetRes, memberRes]) => {
      if (budgetRes.error) { setError(budgetRes.error.message); setLoading(false); return; }

      // Resolve member profiles
      const memberData = memberRes.data ?? [];
      const userIds = memberData.map(m => m.user_id).filter(Boolean);
      let profileMap = {};
      if (userIds.length > 0) {
        const { data: profileData } = await supabase
          .from('profiles').select('id, name, email').in('id', userIds);
        (profileData ?? []).forEach(p => { profileMap[p.id] = p; });
      }
      const mergedMembers = memberData.map(m => ({
        ...m,
        profile: profileMap[m.user_id] ?? null,
      }));

      setRows(budgetRes.data ?? []);
      setMembers(mergedMembers);
      setLoading(false);
    });
  }, [tripId]);

  const addExpense = async ({ description, amount, currency, category, paid_by }) => {
    const { data: row, error: err } = await supabase
      .from('budget')
      .insert({
        trip_id:      tripId,
        description:  description.trim(),
        spent_amount: Number(amount),
        total_amount: 0,
        currency,
        category,
        paid_by:      paid_by || null,
      })
      .select()
      .single();
    if (err) throw err;
    setRows(prev => [row, ...prev]);
    return row;
  };

  const deleteExpense = async (id) => {
    const { error: err } = await supabase.from('budget').delete().eq('id', id);
    if (err) throw err;
    setRows(prev => prev.filter(r => r.id !== id));
  };

  // Aggregates (derived from rows — no useState needed)
  const total = rows.reduce((s, r) => s + Number(r.total_amount), 0);
  const spent = rows.reduce((s, r) => s + Number(r.spent_amount), 0);

  const categoryMap = {};
  rows.forEach((row, i) => {
    if (!categoryMap[row.category]) {
      categoryMap[row.category] = { category: row.category, totalBudget: 0, totalSpent: 0, idx: i };
    }
    categoryMap[row.category].totalBudget += Number(row.total_amount);
    categoryMap[row.category].totalSpent  += Number(row.spent_amount);
  });
  const categories = Object.values(categoryMap).map(c => ({
    ...c,
    color: colorForCategory(c.category, c.idx),
  }));

  // Per-member spending
  const paidByMap = {};
  rows.forEach(row => {
    if (!row.paid_by) return;
    paidByMap[row.paid_by] = (paidByMap[row.paid_by] ?? 0) + Number(row.spent_amount);
  });
  const paidByBreakdown = Object.entries(paidByMap).map(([profileId, amount]) => {
    const member = members.find(m => m.user_id === profileId);
    return { profileId, name: member?.profile?.name ?? 'Unknown', amount };
  }).sort((a, b) => b.amount - a.amount);

  const budget = rows.length > 0 ? { total, spent, categories, paidByBreakdown, rows } : null;

  return { budget, loading, error, members, addExpense, deleteExpense };
}
