import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Postgres time type returns '08:00:00' — trim to 'HH:MM'
const fmtTime = t => (t ? t.slice(0, 5) : '');

export function useItinerary(tripId) {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tripId) { setLoading(false); return; }
    setLoading(true);
    supabase
      .from('itinerary_items')
      .select('*')
      .eq('trip_id', tripId)
      .order('day_number', { ascending: true })
      .order('time', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
        } else {
          // Group into { day, items[] } — no day_date column exists
          const grouped = [];
          (data ?? []).forEach(row => {
            let group = grouped.find(g => g.day === row.day_number);
            if (!group) {
              group = { day: row.day_number, items: [] };
              grouped.push(group);
            }
            group.items.push({ ...row, time: fmtTime(row.time) });
          });
          setDays(grouped);
        }
        setLoading(false);
      });
  }, [tripId]);

  const addItem = async (itemData) => {
    const { data: item, error: err } = await supabase
      .from('itinerary_items')
      .insert(itemData)
      .select()
      .single();
    if (err) throw err;

    const formatted = { ...item, time: fmtTime(item.time) };

    setDays(prev => {
      const existing = prev.find(g => g.day === item.day_number);
      if (existing) {
        const newItems = [...existing.items, formatted]
          .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
        return prev.map(g => g.day === item.day_number ? { ...g, items: newItems } : g);
      }
      return [...prev, { day: item.day_number, items: [formatted] }]
        .sort((a, b) => a.day - b.day);
    });

    return formatted;
  };

  const updateItem = async (id, itemData) => {
    const { data: item, error: err } = await supabase
      .from('itinerary_items')
      .update(itemData)
      .eq('id', id)
      .select()
      .single();
    if (err) throw err;

    const formatted = { ...item, time: fmtTime(item.time) };

    setDays(prev => {
      // Remove from whichever day it was in
      const without = prev
        .map(g => ({ ...g, items: g.items.filter(i => i.id !== id) }))
        .filter(g => g.items.length > 0);
      // Insert into correct day (day may have changed)
      const existing = without.find(g => g.day === item.day_number);
      if (existing) {
        const newItems = [...existing.items, formatted]
          .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
        return without.map(g => g.day === item.day_number ? { ...g, items: newItems } : g);
      }
      return [...without, { day: item.day_number, items: [formatted] }]
        .sort((a, b) => a.day - b.day);
    });

    return formatted;
  };

  const deleteItem = async (id) => {
    const { error: err } = await supabase.from('itinerary_items').delete().eq('id', id);
    if (err) throw err;
    setDays(prev => prev
      .map(g => ({ ...g, items: g.items.filter(i => i.id !== id) }))
      .filter(g => g.items.length > 0)
    );
  };

  return { days, loading, error, addItem, updateItem, deleteItem };
}
