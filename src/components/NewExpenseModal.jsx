import { useState } from 'react';

const CATEGORIES = ['Flights', 'Accommodation', 'Food', 'Activities', 'Transport', 'Shopping', 'Other'];
const CURRENCIES  = ['AUD', 'USD', 'EUR', 'GBP', 'JPY', 'SGD', 'NZD'];

const CAT_EMOJIS = {
  Flights: '✈', Accommodation: '🏨', Food: '🍜',
  Activities: '🎯', Transport: '🚆', Shopping: '🛍️', Other: '💳',
};

export default function NewExpenseModal({ members, onSave, onClose }) {
  const [form, setForm] = useState({
    description: '',
    amount:      '',
    currency:    'AUD',
    category:    'Food',
    paid_by:     members[0]?.user_id ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!form.description.trim()) { setError('Description is required.');        return; }
    if (!form.amount || Number(form.amount) <= 0) { setError('Enter a valid amount.'); return; }

    setSaving(true);
    setError('');
    try {
      await onSave(form);
    } catch (e) {
      setError(e.message ?? 'Something went wrong.');
      setSaving(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(30,20,10,0.45)',
        display: 'flex', alignItems: 'flex-end',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 430, margin: '0 auto',
          background: 'var(--white)', borderRadius: '24px 24px 0 0',
          padding: '0 0 40px', maxHeight: '92vh', overflowY: 'auto',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 0' }}>
          <div style={{ width: 40, height: 4, borderRadius: 99, background: 'var(--border)' }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px 20px', borderBottom: '1px solid var(--border)',
        }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: 'var(--text-primary)' }}>
            Add Expense
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'var(--cream-dark)', border: 'none', borderRadius: '50%',
              width: 32, height: 32, fontSize: 18, color: 'var(--text-secondary)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >×</button>
        </div>

        <div style={{ padding: '24px 24px 0' }}>

          {/* Amount + Currency */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <Field label="Amount">
              <input
                type="number" min={0} step="0.01" placeholder="0.00"
                value={form.amount}
                onChange={e => set('amount', e.target.value)}
                style={{ ...inputStyle, fontSize: 20, fontWeight: 600 }}
                autoFocus
              />
            </Field>
            <Field label="Currency">
              <select
                value={form.currency}
                onChange={e => set('currency', e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {CURRENCIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          {/* Description */}
          <Field label="Description">
            <input
              type="text"
              placeholder="e.g. Dinner at Nobu"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              style={inputStyle}
            />
          </Field>

          {/* Category */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Category</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => set('category', cat)}
                  style={{
                    padding: '7px 14px', borderRadius: 20, border: 'none',
                    cursor: 'pointer', fontSize: 13, fontWeight: 500,
                    background: form.category === cat ? 'var(--text-primary)' : 'var(--cream-dark)',
                    color:      form.category === cat ? 'var(--cream)'        : 'var(--text-secondary)',
                    transition: 'all 0.15s',
                  }}
                >
                  {CAT_EMOJIS[cat]} {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Paid by */}
          {members.length > 0 && (
            <Field label="Paid by">
              <select
                value={form.paid_by}
                onChange={e => set('paid_by', e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="">— Unassigned —</option>
                {members.map(m => (
                  <option key={m.user_id} value={m.user_id}>
                    {m.profile?.name ?? m.profile?.email ?? 'Unknown'}
                  </option>
                ))}
              </select>
            </Field>
          )}

          {/* Error */}
          {error && (
            <p style={{
              fontSize: 13, color: '#c0392b',
              background: '#fdf0ef', borderRadius: 8,
              padding: '10px 14px', marginBottom: 16,
            }}>
              {error}
            </p>
          )}

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: '100%', padding: '16px',
              background: saving ? 'var(--text-secondary)' : 'var(--text-primary)',
              color: 'var(--cream)', border: 'none', borderRadius: 'var(--radius)',
              fontFamily: "'Playfair Display', serif",
              fontSize: 16, fontWeight: 600,
              cursor: saving ? 'default' : 'pointer',
              letterSpacing: 0.3, transition: 'background 0.2s',
            }}
          >
            {saving ? 'Saving…' : 'Add expense'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

const labelStyle = {
  display: 'block', fontSize: 12, fontWeight: 600,
  color: 'var(--text-secondary)', letterSpacing: 0.5,
  marginBottom: 6, textTransform: 'uppercase',
};

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  padding: '12px 14px',
  border: '1.5px solid var(--border)',
  borderRadius: 10,
  fontSize: 15, color: 'var(--text-primary)',
  background: 'var(--cream)', outline: 'none',
  fontFamily: 'Inter, sans-serif',
};
