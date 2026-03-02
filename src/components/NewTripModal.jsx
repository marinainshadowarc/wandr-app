import { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import PlaneSticker from './PlaneSticker';

const COVER_COLORS = [
  '#e8d5b7', // warm sand
  '#c9a96e', // golden
  '#d4a99a', // dusty rose
  '#7a9e9f', // teal sage
  '#8b9e8b', // sage green
  '#a0856a', // clay
];

export default function NewTripModal({ onSave, onClose }) {
  const { profile } = useProfile();
  const [form, setForm] = useState({
    name: '',
    destination: '',
    start_date: '',
    end_date: '',
    cover_color: COVER_COLORS[0],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!form.name.trim())        { setError('Trip name is required.');       return; }
    if (!form.destination.trim()) { setError('Destination is required.');      return; }
    if (!form.start_date)         { setError('Start date is required.');       return; }
    if (!form.end_date)           { setError('End date is required.');         return; }
    if (form.end_date < form.start_date) { setError('End date must be after start date.'); return; }
    if (!profile?.id)             { setError('Profile not loaded yet. Try again.'); return; }

    setSaving(true);
    setError('');
    try {
      await onSave(form, profile.id);
      onClose();
    } catch (e) {
      setError(e.message ?? 'Something went wrong.');
      setSaving(false);
    }
  };

  return (
    // Overlay
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(30,20,10,0.45)',
        display: 'flex', alignItems: 'flex-end',
      }}
    >
      {/* Sheet */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 430,
          margin: '0 auto',
          background: 'var(--white)',
          borderRadius: '24px 24px 0 0',
          padding: '0 0 40px',
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 0' }}>
          <div style={{ width: 40, height: 4, borderRadius: 99, background: 'var(--border)' }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px 20px',
          borderBottom: '1px solid var(--border)',
        }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: 'var(--text-primary)' }}>
            New Trip
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'var(--cream-dark)', border: 'none', borderRadius: '50%',
              width: 32, height: 32, fontSize: 18, color: 'var(--text-secondary)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: '24px 24px 0' }}>
          {/* Trip name */}
          <Field label="Trip name">
            <input
              type="text"
              placeholder="e.g. Cherry Blossom Season"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              style={inputStyle}
            />
          </Field>

          {/* Destination */}
          <Field label="Destination">
            <input
              type="text"
              placeholder="e.g. Japan"
              value={form.destination}
              onChange={e => set('destination', e.target.value)}
              style={inputStyle}
            />
          </Field>

          {/* Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Start date">
              <input
                type="date"
                value={form.start_date}
                onChange={e => set('start_date', e.target.value)}
                style={inputStyle}
              />
            </Field>
            <Field label="End date">
              <input
                type="date"
                value={form.end_date}
                onChange={e => set('end_date', e.target.value)}
                style={inputStyle}
              />
            </Field>
          </div>

          {/* Cover color */}
          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>Cover color</label>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              {COVER_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => set('cover_color', color)}
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: color, border: 'none', cursor: 'pointer',
                    outline: form.cover_color === color
                      ? '3px solid var(--text-primary)'
                      : '3px solid transparent',
                    outlineOffset: 2,
                    transition: 'outline 0.15s',
                  }}
                />
              ))}
            </div>
          </div>

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

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: '100%', padding: '16px',
              background: saving ? 'var(--text-secondary)' : 'var(--text-primary)',
              color: 'var(--cream)',
              border: 'none', borderRadius: 'var(--radius)',
              fontFamily: "'Playfair Display', serif",
              fontSize: 16, fontWeight: 600, cursor: saving ? 'default' : 'pointer',
              letterSpacing: 0.3, transition: 'background 0.2s',
            }}
          >
            {saving ? 'Creating…' : <span>Create trip <PlaneSticker size={18} /></span>}
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
  display: 'block',
  fontSize: 12, fontWeight: 600,
  color: 'var(--text-secondary)',
  letterSpacing: 0.5,
  marginBottom: 6,
  textTransform: 'uppercase',
};

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  padding: '12px 14px',
  border: '1.5px solid var(--border)',
  borderRadius: 10,
  fontSize: 15, color: 'var(--text-primary)',
  background: 'var(--cream)',
  outline: 'none',
  fontFamily: 'Inter, sans-serif',
};
