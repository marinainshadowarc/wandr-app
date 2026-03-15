import { useState } from 'react';
import { usePals } from '../hooks/usePals';
import { useActivityFeed } from '../hooks/useActivityFeed';
import LoadingState from '../components/LoadingState';
import InvitePalModal from '../components/InvitePalModal';

const ROLE_COLORS = {
  Owner:  { bg: '#fef9c3', text: '#a16207' },
  Editor: { bg: '#e0e7ff', text: '#3730a3' },
  Viewer: { bg: 'var(--cream-dark)', text: 'var(--text-muted)' },
};

export default function Pals({ tripId, tripName, tripDates }) {
  const { members, pendingInvites, loading, error, invitePal, cancelInvite } = usePals(tripId);
  const { activities, loading: feedLoading } = useActivityFeed(tripId);
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
            <div className="card" style={{ marginBottom: 14 }}>
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

          {/* Activity Feed */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">Activity</h2>
            </div>
            {feedLoading ? (
              <p style={{ fontSize: 13, color: 'var(--text-muted)', padding: '12px 0' }}>Loading activity...</p>
            ) : activities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: 13 }}>No activity yet. Actions will appear here.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {activities.map((a, idx) => (
                  <ActivityRow key={a.id ?? idx} activity={a} isLast={idx === activities.length - 1} />
                ))}
              </div>
            )}
          </div>
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

/* ── Activity Feed helpers ── */

const ACTION_LABELS = {
  created_trip:   'created the trip',
  added_flight:   'added a flight',
  added_hotel:    'added a hotel',
  added_food:     'added a food spot',
  added_activity: 'added an activity',
  added_transport:'added transport',
  updated_flight: 'updated a flight',
  updated_hotel:  'updated a hotel',
  updated_food:   'updated a food spot',
  updated_activity:'updated an activity',
  updated_transport:'updated transport',
  deleted_flight: 'removed a flight',
  deleted_hotel:  'removed a hotel',
  deleted_food:   'removed a food spot',
  deleted_activity:'removed an activity',
  deleted_transport:'removed transport',
  updated_budget: 'updated the budget to',
  added_packing:  'added to packing list',
  deleted_packing:'removed from packing list',
  packed_item:    'packed',
  unpacked_item:  'unpacked',
  added_member:   'added a member',
  invited_pal:    'invited',
  joined_trip:    'joined the trip',
};

function formatAction(action, name) {
  const [verb, ...rest] = action.split(':');
  const detail = rest.join(':');
  const label = ACTION_LABELS[verb] ?? verb.replace(/_/g, ' ');
  const displayName = name ?? 'Someone';
  if (!detail) return `${displayName} ${label}`;
  return `${displayName} ${label}: ${detail}`;
}

function timeAgo(dateString) {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diff = Math.max(0, now - then);
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return 'just now';
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const ACTIVITY_COLORS = ['#6366f1', '#ff6b4a', '#10b981', '#f59e0b', '#a855f7', '#06b6d4'];

function ActivityRow({ activity, isLast }) {
  const profile = activity.profiles;
  const name = profile?.name ?? profile?.email ?? 'Someone';
  const initial = name[0]?.toUpperCase() ?? '?';
  // Stable color from user_id hash
  const colorIdx = activity.user_id
    ? activity.user_id.charCodeAt(0) % ACTIVITY_COLORS.length
    : 0;

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '10px 0',
      borderBottom: isLast ? 'none' : '1px solid var(--border)',
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        background: ACTIVITY_COLORS[colorIdx],
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 12, fontWeight: 600,
      }}>
        {initial}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {formatAction(activity.action, name)}
        </p>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
          {timeAgo(activity.created_at)}
        </p>
      </div>
    </div>
  );
}
