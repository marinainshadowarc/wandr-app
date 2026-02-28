import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const CATEGORY_COLORS = {
  Flights:    '#c9a96e',
  Hotels:     '#a0856a',
  Food:       '#7a9e9f',
  Activities: '#b07d62',
  Transport:  '#8b9e8b',
  Shopping:   '#c4a882',
};

// Fallback color for unexpected categories
const colorForCategory = (name, idx) =>
  CATEGORY_COLORS[name] ?? ['#c9a96e','#a0856a','#7a9e9f','#b07d62','#8b9e8b','#c4a882'][idx % 6];

export function useBudget(tripId) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tripId) return;
    setLoading(true);
    supabase
      .from('budget')
      .select('*')
      .eq('trip_id', tripId)
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setRows(data ?? []);
        setLoading(false);
      });
  }, [tripId]);

  // Aggregate totals
  const total = rows.reduce((s, r) => s + Number(r.total_amount), 0);
  const spent = rows.reduce((s, r) => s + Number(r.spent_amount), 0);

  // Group by category
  const categoryMap = {};
  rows.forEach(row => {
    if (!categoryMap[row.category]) {
      categoryMap[row.category] = { category: row.category, totalBudget: 0, totalSpent: 0 };
    }
    categoryMap[row.category].totalBudget += Number(row.total_amount);
    categoryMap[row.category].totalSpent  += Number(row.spent_amount);
  });
  const categories = Object.values(categoryMap).map((c, i) => ({
    ...c,
    color: colorForCategory(c.category, i),
  }));

  const budget = rows.length > 0 ? { total, spent, categories } : null;

  return { budget, loading, error };
}
