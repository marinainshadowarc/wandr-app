import { pals, activityFeed } from '../data/tripData';

const ROLE_COLORS = {
  Owner: { bg: '#fef3e0', text: '#9d7a1e' },
  Editor: { bg: '#e8f0fe', text: '#3d5a9d' },
  Viewer: { bg: 'var(--cream-dark)', text: 'var(--text-muted)' },
};

export default function Pals() {
  return (
    <div className="screen">
      {/* Header */}
      <div style={{ padding: '52px 24px 20px', background: 'var(--cream)' }}>
        <p style={{ fontSize: 12, color: 'var(--brown)', fontWeight: 500, letterSpacing: 0.8, marginBottom: 4 }}>
          TOKYO & KYOTO · MAR 12–26
        </p>
        <h1 style={{ fontSize: 28, color: 'var(--text-primary)' }}>Pals</h1>
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        {/* Pals list */}
        <div className="card" style={{ marginBottom: 14 }}>
          <div className="section-header">
            <h2 className="section-title">Trip Members</h2>
            <button className="section-action">Invite</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {pals.map((pal, idx) => (
              <PalRow key={pal.id} pal={pal} isLast={idx === pals.length - 1} />
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="card">
          <div className="section-header">
            <h2 className="section-title">Activity</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {activityFeed.map((event, idx) => (
              <ActivityRow
                key={event.id}
                event={event}
                isLast={idx === activityFeed.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PalRow({ pal, isLast }) {
  const roleStyle = ROLE_COLORS[pal.role] || ROLE_COLORS.Viewer;
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 0',
      borderBottom: isLast ? 'none' : '1px solid var(--border)',
    }}>
      <div className="avatar" style={{ background: pal.color, fontSize: 15 }}>
        {pal.avatar}
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{pal.name}</p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>
          {pal.role === 'Owner' ? 'Trip organizer' : pal.role === 'Editor' ? 'Can edit & add' : 'View only'}
        </p>
      </div>

      <span style={{
        padding: '4px 12px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        background: roleStyle.bg,
        color: roleStyle.text,
      }}>
        {pal.role}
      </span>
    </div>
  );
}

function ActivityRow({ event, isLast }) {
  return (
    <div style={{
      display: 'flex',
      gap: 12,
      padding: '12px 0',
      borderBottom: isLast ? 'none' : '1px solid var(--border)',
    }}>
      {/* Avatar */}
      <div className="avatar avatar-sm" style={{ background: event.color, marginTop: 2 }}>
        {event.avatar}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4 }}>
          <span style={{ fontWeight: 600 }}>{event.person}</span>
          {' '}{event.action}
        </p>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{event.time}</p>
      </div>
    </div>
  );
}
