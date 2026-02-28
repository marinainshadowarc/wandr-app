import { useState } from 'react';
import { useItinerary } from '../hooks/useItinerary';
import LoadingState from '../components/LoadingState';

const TYPE_ICONS = { flight: '✈️', hotel: '🏨', food: '🍜', activity: '🎯' };

export default function Itinerary({ tripId, tripName, tripDates }) {
  const { days, loading, error } = useItinerary(tripId);
  const [activeDay, setActiveDay] = useState(1);
  const currentDay = days.find(d => d.day === activeDay) ?? days[0];

  return (
    <div className="screen">
      <div style={{ padding: '52px 24px 16px', background: 'var(--cream)' }}>
        <p style={{ fontSize: 12, color: 'var(--brown)', fontWeight: 500, letterSpacing: 0.8, marginBottom: 4 }}>
          {tripName ?? 'TRIP'}{tripDates ? ` · ${tripDates}` : ''}
        </p>
        <h1 style={{ fontSize: 28, color: 'var(--text-primary)' }}>Itinerary</h1>
      </div>

      {loading ? (
        <LoadingState message="Loading itinerary…" />
      ) : error ? (
        <div style={{ padding: 24, color: 'var(--brown)' }}>{error}</div>
      ) : days.length === 0 ? (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: 28, marginBottom: 8 }}>📅</p>
          <p>No activities planned yet.</p>
        </div>
      ) : (
        <>
          {/* Day selector */}
          <div style={{
            display: 'flex', gap: 8, padding: '12px 16px',
            overflowX: 'auto', scrollbarWidth: 'none',
            background: 'var(--cream)', borderBottom: '1px solid var(--border)',
          }}>
            {days.map(day => (
              <button
                key={day.day}
                onClick={() => setActiveDay(day.day)}
                style={{
                  flexShrink: 0, padding: '8px 16px', borderRadius: 20,
                  border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                  transition: 'all 0.2s',
                  background: activeDay === day.day ? 'var(--text-primary)' : 'var(--cream-dark)',
                  color: activeDay === day.day ? 'var(--cream)' : 'var(--text-secondary)',
                }}
              >
                Day {day.day}
              </button>
            ))}
          </div>

          {currentDay && (
            <div style={{ padding: '20px 16px' }}>
              <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: 'var(--text-primary)' }}>
                  Day {currentDay.day}
                </h2>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {currentDay.items.length} items · ${currentDay.items.reduce((s, i) => s + Number(i.cost), 0)}
                </span>
              </div>

              <div style={{ position: 'relative' }}>
                {currentDay.items.map((item, idx) => (
                  <TimelineItem key={item.id} item={item} isLast={idx === currentDay.items.length - 1} />
                ))}
              </div>

              <button
                style={{
                  marginTop: 16, width: '100%', padding: '14px',
                  background: 'transparent', color: 'var(--brown)',
                  border: '2px dashed var(--sand)', borderRadius: 'var(--radius)',
                  fontSize: 14, fontWeight: 500, cursor: 'pointer',
                }}
                onClick={() => alert('Add activity coming soon!')}
              >
                + Add activity
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TimelineItem({ item, isLast }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ display: 'flex', marginBottom: isLast ? 0 : 4 }}>
      {/* Time */}
      <div style={{ width: 54, flexShrink: 0, paddingTop: 18, textAlign: 'right', paddingRight: 12 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{item.time}</span>
      </div>

      {/* Connector */}
      <div style={{ width: 20, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: 10, height: 10, borderRadius: '50%', marginTop: 21,
          background: item.is_booked ? 'var(--brown-light)' : 'var(--sand-dark)',
          border: '2px solid var(--white)',
          boxShadow: '0 0 0 2px ' + (item.is_booked ? 'var(--brown-light)' : 'var(--sand-dark)'),
          zIndex: 1,
        }} />
        {!isLast && <div style={{ flex: 1, width: 2, background: 'var(--border)', marginTop: 4 }} />}
      </div>

      {/* Card */}
      <div style={{ flex: 1, paddingBottom: isLast ? 0 : 10 }}>
        <div className="card" onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer', padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                <span className={`tag tag-${item.type}`}>
                  {TYPE_ICONS[item.type] ?? '📌'} {item.type}
                </span>
                {item.is_booked
                  ? <span className="tag" style={{ background: '#e8f5e8', color: '#3d7a45' }}>✓ Booked</span>
                  : <span className="tag" style={{ background: '#fef3e0', color: '#9d7a1e' }}>Unbooked</span>
                }
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{item.title}</p>
              {item.location && !expanded && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>📍 {item.location}</p>
              )}
              {expanded && (
                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {item.location          && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>📍 {item.location}</p>}
                  {item.notes             && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>📝 {item.notes}</p>}
                  {item.confirmation_number && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>🔖 {item.confirmation_number}</p>}
                  {item.type === 'flight' && item.flight_number && (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      ✈️ {item.airline} {item.flight_number} · {item.departure_airport} → {item.arrival_airport}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--brown-dark)' }}>
                {Number(item.cost) === 0 ? 'Free' : `${item.currency ?? '$'}${item.cost}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
