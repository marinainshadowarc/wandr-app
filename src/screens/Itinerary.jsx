import { useState } from 'react';
import { itinerary } from '../data/tripData';

const TYPE_ICONS = {
  flight: '✈️',
  hotel: '🏨',
  food: '🍜',
  activity: '🎯',
};

export default function Itinerary() {
  const [activeDay, setActiveDay] = useState(1);
  const currentDay = itinerary.find(d => d.day === activeDay);

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ padding: '52px 24px 16px', background: 'var(--cream)' }}>
        <p style={{ fontSize: 12, color: 'var(--brown)', fontWeight: 500, letterSpacing: 0.8, marginBottom: 4 }}>
          TOKYO & KYOTO · MAR 12–26
        </p>
        <h1 style={{ fontSize: 28, color: 'var(--text-primary)' }}>Itinerary</h1>
      </div>

      {/* Day selector */}
      <div style={{
        display: 'flex',
        gap: 8,
        padding: '12px 16px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        background: 'var(--cream)',
        borderBottom: '1px solid var(--border)',
      }}>
        {itinerary.map(day => (
          <button
            key={day.day}
            onClick={() => setActiveDay(day.day)}
            style={{
              flexShrink: 0,
              padding: '8px 16px',
              borderRadius: 20,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              transition: 'all 0.2s',
              background: activeDay === day.day ? 'var(--text-primary)' : 'var(--cream-dark)',
              color: activeDay === day.day ? 'var(--cream)' : 'var(--text-secondary)',
            }}
          >
            Day {day.day}
          </button>
        ))}
      </div>

      {/* Day content */}
      <div style={{ padding: '20px 16px' }}>
        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: 'var(--text-primary)' }}>
            {currentDay.date}
          </h2>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {currentDay.items.length} items ·{' '}
            ${currentDay.items.reduce((s, i) => s + i.cost, 0)}
          </span>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          {currentDay.items.map((item, idx) => (
            <TimelineItem key={item.id} item={item} isLast={idx === currentDay.items.length - 1} />
          ))}
        </div>

        {/* Add item */}
        <button
          style={{
            marginTop: 16,
            width: '100%',
            padding: '14px',
            background: 'transparent',
            color: 'var(--brown)',
            border: '2px dashed var(--sand)',
            borderRadius: 'var(--radius)',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
          }}
          onClick={() => alert('Add activity coming soon!')}
        >
          + Add activity
        </button>
      </div>
    </div>
  );
}

function TimelineItem({ item, isLast }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ display: 'flex', gap: 0, marginBottom: isLast ? 0 : 4 }}>
      {/* Time column */}
      <div style={{ width: 54, flexShrink: 0, paddingTop: 18, textAlign: 'right', paddingRight: 12 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{item.time}</span>
      </div>

      {/* Connector */}
      <div style={{ width: 20, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: 10, height: 10, borderRadius: '50%', marginTop: 21,
          background: item.booked ? 'var(--brown-light)' : 'var(--sand-dark)',
          border: '2px solid var(--white)',
          boxShadow: '0 0 0 2px ' + (item.booked ? 'var(--brown-light)' : 'var(--sand-dark)'),
          zIndex: 1,
        }} />
        {!isLast && (
          <div style={{ flex: 1, width: 2, background: 'var(--border)', marginTop: 4 }} />
        )}
      </div>

      {/* Card */}
      <div style={{ flex: 1, paddingBottom: isLast ? 0 : 10 }}>
        <div
          className="card"
          onClick={() => setExpanded(!expanded)}
          style={{ cursor: 'pointer', padding: '14px 16px' }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                <span className={`tag tag-${item.type}`}>
                  {TYPE_ICONS[item.type]} {item.type}
                </span>
                {item.booked ? (
                  <span className="tag" style={{ background: '#e8f5e8', color: '#3d7a45' }}>✓ Booked</span>
                ) : (
                  <span className="tag" style={{ background: '#fef3e0', color: '#9d7a1e' }}>Unbooked</span>
                )}
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{item.title}</p>
              {expanded && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{item.note}</p>
              )}
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--brown-dark)' }}>
                {item.cost === 0 ? 'Free' : `$${item.cost}`}
              </p>
              {item.assignedTo && (
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.assignedTo}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
