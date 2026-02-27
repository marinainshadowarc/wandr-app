import { useState } from 'react';
import { packingList, pals } from '../data/tripData';

export default function Packing() {
  const [items, setItems] = useState(packingList);

  const allItems = items.flatMap(c => c.items);
  const checkedCount = allItems.filter(i => i.checked).length;
  const totalCount = allItems.length;
  const pct = Math.round((checkedCount / totalCount) * 100);

  const toggle = (catIdx, itemId) => {
    setItems(prev => prev.map((cat, ci) =>
      ci !== catIdx ? cat : {
        ...cat,
        items: cat.items.map(item =>
          item.id !== itemId ? item : { ...item, checked: !item.checked }
        ),
      }
    ));
  };

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ padding: '52px 24px 20px', background: 'var(--cream)' }}>
        <p style={{ fontSize: 12, color: 'var(--brown)', fontWeight: 500, letterSpacing: 0.8, marginBottom: 4 }}>
          TOKYO & KYOTO · MAR 12–26
        </p>
        <h1 style={{ fontSize: 28, color: 'var(--text-primary)' }}>Packing</h1>
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        {/* Overall progress */}
        <div className="card" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                {checkedCount} of {totalCount} packed
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                {totalCount - checkedCount} items remaining
              </p>
            </div>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: `conic-gradient(var(--brown-light) ${pct * 3.6}deg, var(--cream-dark) 0deg)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: '50%',
                background: 'var(--white)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: 'var(--text-primary)',
              }}>
                {pct}%
              </div>
            </div>
          </div>
          <div className="progress-bar" style={{ height: 6 }}>
            <div
              className="progress-fill"
              style={{ width: `${pct}%`, background: 'var(--brown-light)' }}
            />
          </div>
        </div>

        {/* Categories */}
        {items.map((cat, catIdx) => {
          const catChecked = cat.items.filter(i => i.checked).length;
          return (
            <div key={cat.category} className="card" style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 20 }}>{cat.emoji}</span>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: 'var(--text-primary)' }}>
                    {cat.category}
                  </h2>
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {catChecked}/{cat.items.length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {cat.items.map(item => (
                  <PackingItem
                    key={item.id}
                    item={item}
                    onToggle={() => toggle(catIdx, item.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PackingItem({ item, onToggle }) {
  const palColor = {
    Marina: '#c9a96e',
    Sofia: '#a0856a',
    Jake: '#7a9e9f',
    Priya: '#b07d62',
  };

  return (
    <div
      onClick={onToggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 4px',
        borderBottom: '1px solid var(--border)',
        cursor: 'pointer',
        transition: 'opacity 0.2s',
        opacity: item.checked ? 0.5 : 1,
      }}
    >
      <div className={`checkbox ${item.checked ? 'checked' : ''}`}>
        {item.checked && (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      <span style={{
        flex: 1,
        fontSize: 14,
        color: 'var(--text-primary)',
        textDecoration: item.checked ? 'line-through' : 'none',
      }}>
        {item.label}
      </span>

      {item.assignedTo && (
        <div
          className="avatar avatar-sm"
          style={{ background: palColor[item.assignedTo] || 'var(--brown)' }}
          title={item.assignedTo}
        >
          {item.assignedTo[0]}
        </div>
      )}
    </div>
  );
}
