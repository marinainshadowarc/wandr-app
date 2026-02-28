import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function usePacking(tripId) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tripId) return;
    setLoading(true);
    supabase
      .from('packing_items')
      .select('*')
      .eq('trip_id', tripId)
      .order('category')
      .order('created_at')
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
        } else {
          // Group by category
          const grouped = [];
          (data ?? []).forEach(row => {
            let group = grouped.find(g => g.category === row.category);
            if (!group) {
              group = { category: row.category, items: [] };
              grouped.push(group);
            }
            group.items.push(row);
          });
          setCategories(grouped);
        }
        setLoading(false);
      });
  }, [tripId]);

  const toggleItem = async (itemId, currentValue) => {
    // Optimistic update
    setCategories(prev => prev.map(cat => ({
      ...cat,
      items: cat.items.map(item =>
        item.id === itemId ? { ...item, is_packed: !currentValue } : item
      ),
    })));
    // Persist — column is is_packed
    await supabase
      .from('packing_items')
      .update({ is_packed: !currentValue })
      .eq('id', itemId);
  };

  return { categories, loading, error, toggleItem };
}
