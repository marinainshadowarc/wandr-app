import { useState } from 'react';
import { usePals } from '../hooks/usePals';
import LoadingState from '../components/LoadingState';
import InvitePalModal from '../components/InvitePalModal';

const ROLE_COLORS = {
  Owner:  { bg: '#fef9c3', text: '#a16207' },
  Editor: { bg: '#e0e7ff', text: '#3730a3' },
  Viewer: { bg: 'var(--cream-dark)', text: 'var(--text-muted)' },
};

export default function Pals({ tripId, tripName, tripDates }) {
  const { members, pendingInvites, loading, error, invitePal, cancelInvite } = usePals(tripId);
  const [showInvite, setShowInvite] = useState(false);

  if (!tripId) return (
    <div className="screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
      <div>
        <p style={{ fontSize: 32, marginBottom: 12 }}>👥</p>
        <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>No trip selected</p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Go to Home and tap a trip to see its pals.</p>
      </div>
    </div>
  );

  return (
    <div className="screen">
      <div style={{ padding: '52px 24px 20px', background: 'var(--cream)' }}>
        <p style={{ fontSize: 12, color: 'var(--brown)', fontWeight: 500, letterSpacing: 0.8, marginBottom: 4 }}>
          {tripName ?? 'TRIP'}{tripDates ? ` · ${tripDates}` : ''}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: 28, color: 'var(--text-primary)' }}>Pals</h1>
          <button
            onClick={() => setShowInvite(true)}
            style={{
              padding: '8px 18px', borderRadius: 20,
              background: 'var(--text-primary)', color: 'var(--cream)',
              border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            + Invite
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading pals…" />
      ) : error ? (
        <div style={{ padding: 24, color: 'var(--brown)' }}>{error}</div>
      ) : (
        <div style={{ padding: '0 16px 16px' }}>

          {/* Members */}
          <div className="card" style={{ marginBottom: 14 }}>
            <div className="section-header">
              <h2 className="section-title">Trip Members</h2>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{members.length} member{members.length !== 1 ? 's' : ''}</span>
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

          {/* Pending invites */}
          {pendingInvites.length > 0 && (
            <div className="card">
              <div className="section-header">
                <h2 className="section-title">Pending Invites</h2>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pendingInvites.length} pending</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {pendingInvites.map((inv, idx) => (
                  <div
                    key={inv.id ?? idx}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 0',
                      borderBottom: idx === pendingInvites.length - 1 ? 'none' : '1px solid var(--border)',
                    }}
                  >
                    {/* Avatar placeholder */}
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      background: 'var(--cream-dark)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16,
                    }}>
                      ✉️
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {inv.invited_email}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>Invite sent</p>
                    </div>
                    <span style={{
                      padding: '4px 12px', borderRadius: 20,
                      fontSize: 11, fontWeight: 600,
                      background: '#e0e7ff', color: '#3730a3',
                    }}>
                      {inv.role}
                    </span>
                    {inv.id && (
                      <button
                        onClick={() => cancelInvite(inv.id)}
                        style={{
                          background: 'none', border: 'none',
                          color: 'var(--text-muted)', fontSize: 18,
                          cursor: 'pointer', padding: '4px 8px',
                          lineHeight: 1,
                        }}
                        title="Cancel invite"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {showInvite && (
        <InvitePalModal
          onInvite={(email, role) => invitePal(email, role, tripName)}
          onClose={() => setShowInvite(false)}
        />
      )}
    </div>
  );
}

function PalRow({ member, isLast }) {
  const roleStyle = ROLE_COLORS[member.role] ?? ROLE_COLORS.Viewer;
  const name    = member.profile?.name ?? member.profile?.email ?? 'Member';
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
