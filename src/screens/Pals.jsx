import { usePals } from '../hooks/usePals';
import LoadingState from '../components/LoadingState';

const ROLE_COLORS = {
  Owner:  { bg: '#fef3e0', text: '#9d7a1e' },
  Editor: { bg: '#e8f0fe', text: '#3d5a9d' },
  Viewer: { bg: 'var(--cream-dark)', text: 'var(--text-muted)' },
};

export default function Pals({ tripId, tripName, tripDates }) {
  const { members, loading, error } = usePals(tripId);

  return (
    <div className="screen">
      <div style={{ padding: '52px 24px 20px', background: 'var(--cream)' }}>
        <p style={{ fontSize: 12, color: 'var(--brown)', fontWeight: 500, letterSpacing: 0.8, marginBottom: 4 }}>
          {tripName ?? 'TRIP'}{tripDates ? ` · ${tripDates}` : ''}
        </p>
        <h1 style={{ fontSize: 28, color: 'var(--text-primary)' }}>Pals</h1>
      </div>

      {loading ? (
        <LoadingState message="Loading pals…" />
      ) : error ? (
        <div style={{ padding: 24, color: 'var(--brown)' }}>{error}</div>
      ) : (
        <div style={{ padding: '0 16px 16px' }}>
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">Trip Members</h2>
              <button className="section-action">Invite</button>
            </div>

            {members.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: 24, marginBottom: 8 }}>👥</p>
                <p style={{ fontSize: 13 }}>No members yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {members.map((member, idx) => (
                  <PalRow key={member.id} member={member} isLast={idx === members.length - 1} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PalRow({ member, isLast }) {
  const roleStyle = ROLE_COLORS[member.role] ?? ROLE_COLORS.Viewer;
  const name    = member.profile?.name ?? 'Unknown';
  const initial = name[0]?.toUpperCase() ?? '?';
  const avatar  = member.profile?.avatar;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 0',
      borderBottom: isLast ? 'none' : '1px solid var(--border)',
    }}>
      <div className="avatar" style={{ background: member.color, fontSize: 15 }}>
        {avatar ? (
          <img src={avatar} alt={name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
        ) : initial}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{name}</p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>
          {member.role === 'Owner' ? 'Trip organizer' : member.role === 'Editor' ? 'Can edit & add' : 'View only'}
        </p>
      </div>
      <span style={{
        padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
        background: roleStyle.bg, color: roleStyle.text,
      }}>
        {member.role}
      </span>
    </div>
  );
}
