import { useState } from 'react';

const ROLES = [
  { value: 'Editor', label: 'Editor', desc: 'Can add & edit activities' },
  { value: 'Viewer', label: 'Viewer', desc: 'View only' },
];

export default function InvitePalModal({ onInvite, onClose }) {
  const [email,   setEmail]   = useState('');
  const [role,    setRole]    = useState('Editor');
  const [sending, setSending] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) { setError('Please enter an email address.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email.'); return; }

    setSending(true);
    setError('');
    try {
      const result = await onInvite(email.trim().toLowerCase(), role);
      setSuccess(result?.existing ?? false);
      if (result?.existing) {
        // Already a Wandr user — added directly, close after brief delay
        setTimeout(onClose, 2000);
      } else {
        setSuccess(true);
      }
    } catch (e) {
      setError(e.message ?? 'Failed to send invite.');
      setSending(false);
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
            Invite a Pal
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
          {success ? (
            /* Success state */
            <div style={{ textAlign: 'center', padding: '24px 0 16px' }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}>🎉</p>
              <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                Invite sent!
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                We emailed <strong>{email}</strong> an invite link to join this trip.
              </p>
              <button
                onClick={onClose}
                style={{
                  marginTop: 24, width: '100%', padding: '14px',
                  background: 'var(--text-primary)', color: 'var(--cream)',
                  border: 'none', borderRadius: 'var(--radius)',
                  fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Email */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Friend's email</label>
                <input
                  type="email"
                  placeholder="friend@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  style={inputStyle}
                  autoFocus
                />
              </div>

              {/* Role */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Role</label>
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  {ROLES.map(r => (
                    <button
                      key={r.value}
                      onClick={() => setRole(r.value)}
                      style={{
                        flex: 1, padding: '12px 10px',
                        borderRadius: 12, cursor: 'pointer',
                        border: role === r.value ? '2px solid var(--text-primary)' : '2px solid var(--border)',
                        background: role === r.value ? 'var(--cream-dark)' : 'var(--white)',
                        textAlign: 'left', transition: 'all 0.15s',
                      }}
                    >
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                        {r.label}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.desc}</p>
                    </button>
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

              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={sending}
                style={{
                  width: '100%', padding: '16px',
                  background: sending ? 'var(--sand-dark)' : 'var(--text-primary)',
                  color: 'var(--cream)', border: 'none', borderRadius: 'var(--radius)',
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 16, fontWeight: 600,
                  cursor: sending ? 'default' : 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                {sending ? 'Sending invite…' : 'Send invite'}
              </button>
            </>
          )}
        </div>
      </div>
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
