import { trips } from '../data/tripData';

export default function Home({ onTripSelect }) {
  return (
    <div className="screen" style={{ padding: '0 0 80px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, #e8d5b7 0%, #faf6f0 60%)',
        padding: '52px 24px 28px',
      }}>
        <p style={{ fontSize: 13, color: 'var(--brown)', fontWeight: 500, marginBottom: 6, letterSpacing: 0.5 }}>
          GOOD MORNING
        </p>
        <h1 style={{ fontSize: 26, lineHeight: 1.25, color: 'var(--text-primary)' }}>
          Welcome, Marina —<br />
          <span style={{ fontStyle: 'italic', color: 'var(--brown)' }}>a brave little explorer</span> 🌍
        </h1>
      </div>

      <div style={{ padding: '0 16px' }}>
        {/* Upcoming trips */}
        <div style={{ marginTop: 24 }}>
          <div className="section-header">
            <h2 className="section-title">Your Trips</h2>
            <button className="section-action">See all</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {trips.map(trip => (
              <TripCard key={trip.id} trip={trip} onSelect={() => onTripSelect(trip)} />
            ))}
          </div>
        </div>

        {/* New trip button */}
        <button
          onClick={() => alert('New trip flow coming soon!')}
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
        <div style={{ marginTop: 28 }}>
          <h2 className="section-title" style={{ marginBottom: 14 }}>At a glance</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <StatCard label="Trips planned" value="2" icon="✈️" />
            <StatCard label="Countries" value="2" icon="🌏" />
            <StatCard label="Travel pals" value="4" icon="👥" />
            <StatCard label="Days away" value="21" icon="📅" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TripCard({ trip, onSelect }) {
  const pct = Math.round((trip.budgetUsed / trip.budget) * 100);
  return (
    <div
      className="card"
      onClick={onSelect}
      style={{ cursor: 'pointer', overflow: 'hidden', padding: 0 }}
    >
      {/* Color band */}
      <div style={{
        height: 8,
        background: `linear-gradient(90deg, var(--brown-light), var(--sand))`,
      }} />

      <div style={{ padding: '18px 20px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 22 }}>{trip.emoji}</span>
              <h3 style={{ fontSize: 18, color: 'var(--text-primary)' }}>{trip.name}</h3>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>{trip.dates}</p>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 600, color: 'var(--brown)',
            background: 'var(--cream-dark)', padding: '4px 10px', borderRadius: 20
          }}>
            Active
          </span>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
          <Stat icon="👥" label={`${trip.people} people`} />
          <Stat icon="📅" label={`${trip.daysPlanned}/${trip.totalDays} days`} />
          <Stat icon="💰" label={`$${(trip.budgetUsed / 1000).toFixed(1)}k used`} />
        </div>

        {/* Budget bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Budget</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{pct}% of ${(trip.budget / 1000).toFixed(1)}k</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${pct}%`,
                background: pct > 80 ? '#c9606e' : 'var(--brown-light)',
              }}
            />
          </div>
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
