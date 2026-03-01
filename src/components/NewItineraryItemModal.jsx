import { useState } from 'react';

const TYPES = ['activity', 'food', 'hotel', 'flight', 'transport'];
const TYPE_ICONS = { flight: '✈️', hotel: '🏨', food: '🍜', activity: '🎯', transport: '🚆' };
const CURRENCIES = ['AUD', 'USD', 'EUR', 'GBP', 'JPY', 'SGD', 'NZD'];
const SHOW_CONFIRMATION = ['flight', 'hotel'];

const PLACEHOLDERS = {
  flight:    'e.g. Flight to Tokyo',
  hotel:     'e.g. Check-in: Park Hyatt',
  food:      'e.g. Dinner at Nobu',
  activity:  'e.g. TeamLab Planets',
  transport: 'e.g. Shinkansen to Kyoto',
};

export default function NewItineraryItemModal({ tripId, defaultDay, onSave, onClose }) {
  const [form, setForm] = useState({
    title: '',
    type: 'activity',
    day_number: defaultDay ?? 1,
    time: '09:00',
    location: '',
    cost: '',
    currency: 'AUD',
    is_booked: false,
    notes: '',
    confirmation_number: '',
    flight_number: '',
    airline: '',
    departure_airport: '',
    arrival_airport: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!form.title.trim())                    { setError('Title is required.');          return; }
    if (!form.day_number || form.day_number < 1) { setError('Day must be at least 1.');   return; }

    setSaving(true);
    setError('');

    const payload = {
      trip_id:             tripId,
      title:               form.title.trim(),
      type:                form.type,
      day_number:          Number(form.day_number),
      time:                form.time || null,
      location:            form.location.trim()            || null,
      cost:                form.cost !== '' ? Number(form.cost) : 0,
      currency:            form.currency,
      is_booked:           form.is_booked,
      notes:               form.notes.trim()               || null,
      confirmation_number: form.confirmation_number.trim() || null,
      flight_number:       form.type === 'flight' ? form.flight_number.trim()       || null : null,
      airline:             form.type === 'flight' ? form.airline.trim()             || null : null,
      departure_airport:   form.type === 'flight' ? form.departure_airport.trim()   || null : null,
      arrival_airport:     form.type === 'flight' ? form.arrival_airport.trim()     || null : null,
    };

    try {
      await onSave(payload);
      onClose();
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
          background: 'var(--white)',
          borderRadius: '24px 24px 0 0',
          padding: '0 0 40px',
          maxHeight: '92vh', overflowY: 'auto',
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
            Add Activity
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

          {/* Type selector */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Type</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
              {TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => set('type', t)}
                  style={{
                    padding: '7px 14px', borderRadius: 20, border: 'none',
                    cursor: 'pointer', fontSize: 13, fontWeight: 500,
                    background: form.type === t ? 'var(--text-primary)' : 'var(--cream-dark)',
                    color:      form.type === t ? 'var(--cream)'        : 'var(--text-secondary)',
                    transition: 'all 0.15s',
                  }}
                >
                  {TYPE_ICONS[t]} {t}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <Field label="Title">
            <input
              type="text"
              placeholder={PLACEHOLDERS[form.type]}
              value={form.title}
              onChange={e => set('title', e.target.value)}
              style={inputStyle}
            />
          </Field>

          {/* Day + Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Day">
              <input
                type="number" min={1}
                value={form.day_number}
                onChange={e => set('day_number', e.target.value)}
                style={inputStyle}
              />
            </Field>
            <Field label="Time">
              <input
                type="time"
                value={form.time}
                onChange={e => set('time', e.target.value)}
                style={inputStyle}
              />
            </Field>
          </div>

          {/* Location */}
          <Field label="Location">
            <input
              type="text"
              placeholder="e.g. Shibuya, Tokyo"
              value={form.location}
              onChange={e => set('location', e.target.value)}
              style={inputStyle}
            />
          </Field>

          {/* Cost + Currency */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <Field label="Cost">
              <input
                type="number" min={0} step="0.01" placeholder="0"
                value={form.cost}
                onChange={e => set('cost', e.target.value)}
                style={inputStyle}
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

          {/* Booked toggle */}
          <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>Booked</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                {form.is_booked ? 'Confirmed ✓' : 'Not yet booked'}
              </p>
            </div>
            <div
              onClick={() => set('is_booked', !form.is_booked)}
              style={{
                width: 48, height: 28, borderRadius: 14, flexShrink: 0,
                background: form.is_booked ? 'var(--brown-light)' : 'var(--border)',
                position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
              }}
            >
              <div style={{
                position: 'absolute', top: 3,
                left: form.is_booked ? 23 : 3,
                width: 22, height: 22, borderRadius: '50%',
                background: 'white', transition: 'left 0.2s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }} />
            </div>
          </div>

          {/* Confirmation number — flight + hotel */}
          {SHOW_CONFIRMATION.includes(form.type) && (
            <Field label="Confirmation number">
              <input
                type="text" placeholder="e.g. ABC123"
                value={form.confirmation_number}
                onChange={e => set('confirmation_number', e.target.value)}
                style={inputStyle}
              />
            </Field>
          )}

          {/* Flight-specific fields */}
          {form.type === 'flight' && (
            <div style={{
              background: 'var(--cream)', borderRadius: 12,
              padding: '16px', marginBottom: 20,
              border: '1px solid var(--border)',
            }}>
              <p style={{
                fontSize: 12, fontWeight: 600, color: 'var(--brown)',
                letterSpacing: 0.5, marginBottom: 14, textTransform: 'uppercase',
              }}>
                ✈️ Flight details
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <Field label="Airline" slim>
                  <input type="text" placeholder="e.g. Qantas"
                    value={form.airline} onChange={e => set('airline', e.target.value)}
                    style={inputStyle} />
                </Field>
                <Field label="Flight no." slim>
                  <input type="text" placeholder="e.g. QF9"
                    value={form.flight_number} onChange={e => set('flight_number', e.target.value)}
                    style={inputStyle} />
                </Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="From" slim>
                  <input type="text" placeholder="SYD"
                    value={form.departure_airport} onChange={e => set('departure_airport', e.target.value.toUpperCase())}
                    style={{ ...inputStyle, textTransform: 'uppercase', letterSpacing: 1 }} />
                </Field>
                <Field label="To" slim>
                  <input type="text" placeholder="NRT"
                    value={form.arrival_airport} onChange={e => set('arrival_airport', e.target.value.toUpperCase())}
                    style={{ ...inputStyle, textTransform: 'uppercase', letterSpacing: 1 }} />
                </Field>
              </div>
            </div>
          )}

          {/* Notes */}
          <Field label="Notes (optional)">
            <textarea
              placeholder="Any extra details…"
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
            />
          </Field>

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
            {saving ? 'Saving…' : 'Add to itinerary'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, slim }) {
  return (
    <div style={{ marginBottom: slim ? 0 : 20 }}>
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
