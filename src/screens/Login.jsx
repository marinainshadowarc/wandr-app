import { useState } from 'react';
import { supabase } from '../lib/supabase';
import EarthSticker from '../components/EarthSticker';

export default function Login({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

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
          Welcome back
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
          Sign in to your account
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
            placeholder="••••••••"
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
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="divider" style={{ margin: '20px 0' }} />

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <button
            onClick={onSwitch}
            style={{
              background: 'none', border: 'none',
              color: 'var(--brown-light)', fontWeight: 600,
              fontSize: 13, cursor: 'pointer',
            }}
          >
            Sign up
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
