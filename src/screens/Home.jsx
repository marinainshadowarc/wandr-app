import { useState } from 'react';
import { useTrips } from '../hooks/useTrips';
import { useProfile } from '../hooks/useProfile';
import LoadingState from '../components/LoadingState';
import NewTripModal from '../components/NewTripModal';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'GOOD MORNING';
  if (h < 17) return 'GOOD AFTERNOON';
  return 'GOOD EVENING';
}

export default function Home({ onTripSelect, onSignOut }) {
  const { trips, loading, addTrip } = useTrips();
  const { firstName } = useProfile();
  const [showNewTrip, setShowNewTrip] = useState(false);

  return (
    <div className="screen" style={{ padding: '0 0 80px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, #e8d5b7 0%, #faf6f0 60%)',
        padding: '52px 24px 28px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: 13, color: 'var(--brown)', fontWeight: 500, marginBottom: 6, letterSpacing: 0.5 }}>
              {greeting()}
            </p>
            <h1 style={{ fontSize: 26, lineHeight: 1.25, color: 'var(--text-primary)' }}>
              Welcome, {firstName} —<br />
              <span style={{ fontStyle: 'italic', color: 'var(--brown)' }}>a brave little explorer</span> 🌍
            </h1>
          </div>
          <button
            onClick={onSignOut}
            style={{
              marginTop: 4,
              background: 'rgba(255,255,255,0.6)',
              border: '1px solid var(--border)',
              borderRadius: 20,
              padding: '6px 14px',
              fontSize: 12,
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 500,
              flexShrink: 0,
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        {/* Trips */}
        <div style={{ marginTop: 24 }}>
          <div className="section-header">
            <h2 className="section-title">Your Trips</h2>
            <button className="section-action">See all</button>
          </div>

          {loading ? (
            <LoadingState message="Fetching trips…" />
          ) : trips.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '32px 20px', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: 28, marginBottom: 8 }}>🗺️</p>
              <p style={{ fontSize: 14 }}>No trips yet. Start planning one!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {trips.map(trip => (
                <TripCard key={trip.id} trip={trip} onSelect={() => onTripSelect(trip)} />
              ))}
            </div>
          )}
        </div>

        {/* New trip button */}
        <button
          onClick={() => setShowNewTrip(true)}
          style={{
            marginTop: 20,
            width: '100%',
            padding: '16px',
            background: 'var(--text-primary)',
            color: 'var(--cream)',
            border: 'none',
            borderRadius: 'var(--radius)',
            fontFamily: "'Playfair Display', serif",
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: 0.3,
          }}
        >
          + Start a new trip
        </button>

        {/* Quick stats */}
        {!loading && trips.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <h2 className="section-title" style={{ marginBottom: 14 }}>At a glance</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <StatCard label="Trips planned" value={trips.length} icon="✈️" />
              <StatCard label="Countries" value={new Set(trips.map(t => t.destination).filter(Boolean)).size} icon="🌏" />
            </div>
          </div>
        )}
      </div>

      {showNewTrip && (
        <NewTripModal
          onSave={addTrip}
          onClose={() => setShowNewTrip(false)}
        />
      )}
    </div>
  );
}

function TripCard({ trip, onSelect }) {
  const fmt = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const dateRange = trip.start_date && trip.end_date
    ? `${fmt(trip.start_date)} – ${fmt(trip.end_date)}`
    : trip.start_date ? fmt(trip.start_date) : '';

  const totalDays = trip.start_date && trip.end_date
    ? Math.round((new Date(trip.end_date) - new Date(trip.start_date)) / 86400000) + 1
    : null;

  return (
    <div
      className="card"
      onClick={onSelect}
      style={{ cursor: 'pointer', overflow: 'hidden', padding: 0 }}
    >
      <div style={{ height: 8, background: 'linear-gradient(90deg, var(--brown-light), var(--sand))' }} />
      <div style={{ padding: '18px 20px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ fontSize: 18, color: 'var(--text-primary)', marginBottom: 4 }}>{trip.name}</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>{dateRange}</p>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 600, color: 'var(--brown)',
            background: 'var(--cream-dark)', padding: '4px 10px', borderRadius: 20,
          }}>
            Active
          </span>
        </div>

        <div style={{ display: 'flex', gap: 20 }}>
          {trip.destination && <Stat icon="📍" label={trip.destination} />}
          {totalDays && <Stat icon="📅" label={`${totalDays} days`} />}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <span style={{ fontSize: 13 }}>{icon}</span>
      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '18px 12px' }}>
      <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: 'var(--text-primary)' }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
    </div>
  );
}
