import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { logActivity } from '../lib/activityLogger';

const MEMBER_COLORS = ['#6366f1', '#ff6b4a', '#10b981', '#f59e0b', '#a855f7', '#06b6d4'];

export function usePacking(tripId) {
  const [categories, setCategories] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tripId) { setLoading(false); return; }
    setLoading(true);

    Promise.all([
      supabase
        .from('packing_items')
        .select('*')
        .eq('trip_id', tripId)
        .order('category')
        .order('created_at'),
      supabase
        .from('trip_members')
        .select('*')
        .eq('trip_id', tripId),
    ]).then(async ([{ data: itemData, error: itemErr }, { data: memberData, error: memberErr }]) => {
      if (itemErr) { setError(itemErr.message); setLoading(false); return; }

      // Group items by category
      const grouped = [];
      (itemData ?? []).forEach(row => {
        let group = grouped.find(g => g.category === row.category);
        if (!group) {
          group = { category: row.category, items: [] };
          grouped.push(group);
        }
        group.items.push(row);
      });
      setCategories(grouped);

      // Fetch member profiles
      if (!memberErr) {
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
      }

      setLoading(false);
    }).catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, [tripId]);

  const toggleItem = async (itemId, currentValue) => {
    // Capture item name before state update
    let itemName;
    for (const cat of categories) {
      const found = cat.items.find(i => i.id === itemId);
      if (found) { itemName = found.name; break; }
    }
    setCategories(prev => prev.map(cat => ({
      ...cat,
      items: cat.items.map(item =>
        item.id === itemId ? { ...item, is_packed: !currentValue } : item
      ),
    })));
    await supabase
      .from('packing_items')
      .update({ is_packed: !currentValue })
      .eq('id', itemId);
    if (itemName) {
      const verb = !currentValue ? 'packed_item' : 'unpacked_item';
      logActivity(tripId, `${verb}:${itemName}`, 'packing');
    }
  };

  const addItem = async (payload) => {
    const { data, error: insertErr } = await supabase
      .from('packing_items')
      .insert({ ...payload, trip_id: tripId, is_packed: false })
      .select()
      .single();
    if (insertErr) throw insertErr;

    // Optimistically add to correct category group
    setCategories(prev => {
      const existing = prev.find(g => g.category === data.category);
      if (existing) {
        return prev.map(g =>
          g.category === data.category ? { ...g, items: [...g.items, data] } : g
        );
      }
      return [...prev, { category: data.category, items: [data] }];
    });
    logActivity(tripId, `added_packing:${data.name}`, 'packing');
  };

  const deleteItem = async (itemId) => {
    // Capture item name before removal
    let itemName;
    for (const cat of categories) {
      const found = cat.items.find(i => i.id === itemId);
      if (found) { itemName = found.name; break; }
    }
    // Optimistic remove
    setCategories(prev =>
      prev
        .map(cat => ({ ...cat, items: cat.items.filter(i => i.id !== itemId) }))
        .filter(cat => cat.items.length > 0)
    );
    await supabase.from('packing_items').delete().eq('id', itemId);
    if (itemName) {
      logActivity(tripId, `deleted_packing:${itemName}`, 'packing');
    }
  };

  return { categories, members, loading, error, toggleItem, addItem, deleteItem };
}
