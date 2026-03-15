import { useState } from 'react';
import { useItinerary } from '../hooks/useItinerary';
import LoadingState from '../components/LoadingState';
import NewItineraryItemModal from '../components/NewItineraryItemModal';
import PlaneSticker from '../components/PlaneSticker';
import PinSticker from '../components/PinSticker';
import CalendarSticker from '../components/CalendarSticker';

const FoodIcon = ({ size = 18 }) => <img src="/food.png" alt="food" style={{ width: size, height: size, verticalAlign: 'middle' }} />;
const TYPE_ICONS = { flight: <PlaneSticker size={40} />, hotel: '🏨', food: <FoodIcon />, activity: '🎯', transport: '🚆' };

export default function Itinerary({ tripId, tripName, tripDates }) {
  const { days, loading, error, addItem, updateItem, deleteItem } = useItinerary(tripId);
  const [activeDay,    setActiveDay]    = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalDay,     setModalDay]     = useState(1);
  const [editingItem,  setEditingItem]  = useState(null);

  const currentDay = days.find(d => d.day === activeDay) ?? days[0];

  const openAdd = (day) => { setModalDay(day); setShowAddModal(true); };

  const handleAddSave = async (payload) => {
    const item = await addItem(payload);
    setActiveDay(item.day_number);
  };

  const handleEditSave = async (payload) => {
    const item = await updateItem(editingItem.id, payload);
    setActiveDay(item.day_number);
  };

  const handleEditDelete = async () => {
    await deleteItem(editingItem.id);
  };

  return (
    <div className="screen">
      <div style={{ padding: '52px 24px 16px', background: 'var(--cream)' }}>
        <p style={{ fontSize: 12, color: 'var(--brown)', fontWeight: 500, letterSpacing: 0.8, marginBottom: 4 }}>
          {tripName ?? 'TRIP'}{tripDates ? ` · ${tripDates}` : ''}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: 28, color: 'var(--text-primary)' }}>Itinerary</h1>
          <button
            onClick={() => openAdd(activeDay || 1)}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--text-primary)', color: 'var(--cream)',
              border: 'none', fontSize: 22, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 300,
            }}
          >+</button>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading itinerary…" />
      ) : error ? (
        <div style={{ padding: 24, color: 'var(--brown)' }}>{error}</div>
      ) : days.length === 0 ? (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
          <CalendarSticker size={48} />
          <p style={{ marginBottom: 20 }}>No activities planned yet.</p>
          <button
            onClick={() => openAdd(1)}
            style={{
              padding: '12px 28px',
              background: 'var(--text-primary)', color: 'var(--cream)',
              border: 'none', borderRadius: 'var(--radius)',
              fontFamily: "'Playfair Display', serif",
              fontSize: 15, fontWeight: 600, cursor: 'pointer',
            }}
          >
            + Add first activity
          </button>
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
                  color:      activeDay === day.day ? 'var(--cream)'        : 'var(--text-secondary)',
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
                  <TimelineItem
                    key={item.id}
                    item={item}
                    isLast={idx === currentDay.items.length - 1}
                    onEdit={() => setEditingItem(item)}
                  />
                ))}
              </div>

              <button
                onClick={() => openAdd(currentDay.day)}
                style={{
                  marginTop: 16, width: '100%', padding: '14px',
                  background: 'transparent', color: 'var(--brown)',
                  border: '2px dashed var(--sand)', borderRadius: 'var(--radius)',
                  fontSize: 14, fontWeight: 500, cursor: 'pointer',
                }}
              >
                + Add activity
              </button>
            </div>
          )}
        </>
      )}

      {/* Add modal */}
      {showAddModal && (
        <NewItineraryItemModal
          tripId={tripId}
          defaultDay={modalDay}
          onSave={handleAddSave}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Edit modal */}
      {editingItem && (
        <NewItineraryItemModal
          initialData={editingItem}
          onSave={handleEditSave}
          onDelete={handleEditDelete}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}

function TimelineItem({ item, isLast, onEdit }) {
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

      {/* Card — tap to edit */}
      <div style={{ flex: 1, paddingBottom: isLast ? 0 : 10 }}>
        <div
          className="card"
          onClick={onEdit}
          style={{ cursor: 'pointer', padding: '14px 16px' }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                <span className={`tag tag-${item.type}`}>
                  {TYPE_ICONS[item.type] ?? '📌'} {item.type}
                </span>
                {item.is_booked
                  ? <span className="tag" style={{ background: '#d1fae5', color: '#065f46' }}>✓ Booked</span>
                  : <span className="tag" style={{ background: '#fef9c3', color: '#a16207' }}>Unbooked</span>
                }
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                {item.title}
              </p>
              {item.location && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}><PinSticker size={48} /> {item.location}</p>
              )}
              {item.notes && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>📝 {item.notes}</p>
              )}
              {item.type === 'flight' && item.flight_number && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  <PlaneSticker size={40} /> {item.airline} {item.flight_number} · {item.departure_airport} → {item.arrival_airport}
                </p>
              )}
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--brown-dark)' }}>
                {Number(item.cost) === 0 ? 'Free' : `${item.currency ?? '$'}${item.cost}`}
              </p>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>tap to edit</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
