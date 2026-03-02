import { useState } from 'react';
import { supabase } from '../lib/supabase';
import EarthSticker from '../components/EarthSticker';

export default function Signup({ onSwitch }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #e8d5b7 0%, #faf6f0 55%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
        <div className="card" style={{ width: '100%', maxWidth: 360, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 8 }}>
            Check your email
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 24 }}>
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
          </p>
          <button
            onClick={onSwitch}
            style={{
              padding: '12px 24px',
              background: 'var(--text-primary)',
              color: 'var(--cream)',
              border: 'none',
              borderRadius: 'var(--radius)',
              fontFamily: "'Playfair Display', serif",
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #e8d5b7 0%, #faf6f0 55%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ marginBottom: 8 }}><EarthSticker size={56} /></div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 36,
          color: 'var(--text-primary)',
          letterSpacing: -0.5,
        }}>
          Wandr
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
          Plan together, explore everywhere
        </p>
      </div>

      {/* Card */}
      <div className="card" style={{ width: '100%', maxWidth: 360 }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 22,
          color: 'var(--text-primary)',
          marginBottom: 6,
        }}>
          Create account
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
          Start planning your next adventure
        </p>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field
            label="Full name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Marina Chen"
            required
          />
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            required
          />

          {error && (
            <div style={{
              padding: '10px 14px',
              background: '#fde8e8',
              borderRadius: 'var(--radius-sm)',
              fontSize: 13,
              color: '#9d3d3d',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4,
              padding: '14px',
              background: loading ? 'var(--sand-dark)' : 'var(--text-primary)',
              color: 'var(--cream)',
              border: 'none',
              borderRadius: 'var(--radius)',
              fontFamily: "'Playfair Display', serif",
              fontSize: 16,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="divider" style={{ margin: '20px 0' }} />

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <button
            onClick={onSwitch}
            style={{
              background: 'none', border: 'none',
              color: 'var(--brown-light)', fontWeight: 600,
              fontSize: 13, cursor: 'pointer',
            }}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder, required }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: 0.4, display: 'block', marginBottom: 6 }}>
        {label.toUpperCase()}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          width: '100%',
          padding: '12px 14px',
          background: 'var(--cream)',
          border: '1.5px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          fontSize: 15,
          color: 'var(--text-primary)',
          outline: 'none',
          fontFamily: "'Inter', sans-serif",
          transition: 'border-color 0.2s',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--brown-light)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  );
}
