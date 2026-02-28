import { usePacking } from '../hooks/usePacking';
import LoadingState from '../components/LoadingState';

const CATEGORY_EMOJIS = {
  Documents: '📄',
  Tech:      '🔌',
  Clothing:  '👗',
  Health:    '💊',
};

export default function Packing({ tripId, tripName, tripDates }) {
  const { categories, loading, error, toggleItem } = usePacking(tripId);

  const allItems = categories.flatMap(c => c.items);
  const packedCount = allItems.filter(i => i.is_packed).length;
  const totalCount = allItems.length;
  const pct = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  return (
    <div className="screen">
      <div style={{ padding: '52px 24px 20px', background: 'var(--cream)' }}>
        <p style={{ fontSize: 12, color: 'var(--brown)', fontWeight: 500, letterSpacing: 0.8, marginBottom: 4 }}>
          {tripName ?? 'TRIP'}{tripDates ? ` · ${tripDates}` : ''}
        </p>
        <h1 style={{ fontSize: 28, color: 'var(--text-primary)' }}>Packing</h1>
      </div>

      {loading ? (
        <LoadingState message="Loading packing list…" />
      ) : error ? (
        <div style={{ padding: 24, color: 'var(--brown)' }}>{error}</div>
      ) : (
        <div style={{ padding: '0 16px 16px' }}>
          {/* Progress */}
          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {packedCount} of {totalCount} packed
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  {totalCount - packedCount} items remaining
                </p>
              </div>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: `conic-gradient(var(--brown-light) ${pct * 3.6}deg, var(--cream-dark) 0deg)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: '50%', background: 'var(--white)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: 'var(--text-primary)',
                }}>
                  {pct}%
                </div>
              </div>
            </div>
            <div className="progress-bar" style={{ height: 6 }}>
              <div className="progress-fill" style={{ width: `${pct}%`, background: 'var(--brown-light)' }} />
            </div>
          </div>

          {/* Categories */}
          {categories.map(cat => {
            const catPacked = cat.items.filter(i => i.is_packed).length;
            const emoji = CATEGORY_EMOJIS[cat.category] ?? '🧳';
            return (
              <div key={cat.category} className="card" style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{emoji}</span>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: 'var(--text-primary)' }}>
                      {cat.category}
                    </h2>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {catPacked}/{cat.items.length}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {cat.items.map(item => (
                    <PackingItem
                      key={item.id}
                      item={item}
                      onToggle={() => toggleItem(item.id, item.is_packed)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PackingItem({ item, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 4px', borderBottom: '1px solid var(--border)',
        cursor: 'pointer', transition: 'opacity 0.2s',
        opacity: item.is_packed ? 0.5 : 1,
      }}
    >
      <div className={`checkbox ${item.is_packed ? 'checked' : ''}`}>
        {item.is_packed && (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <span style={{
          fontSize: 14, color: 'var(--text-primary)',
          textDecoration: item.is_packed ? 'line-through' : 'none',
        }}>
          {item.name}
        </span>
        {item.notes && (
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{item.notes}</p>
        )}
      </div>
    </div>
  );
}
