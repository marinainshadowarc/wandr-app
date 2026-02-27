import { budget } from '../data/tripData';

export default function Budget() {
  const pct = Math.round((budget.spent / budget.total) * 100);
  const remaining = budget.total - budget.spent;
  const perPerson = Math.round(budget.spent / 4);

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ padding: '52px 24px 20px', background: 'var(--cream)' }}>
        <p style={{ fontSize: 12, color: 'var(--brown)', fontWeight: 500, letterSpacing: 0.8, marginBottom: 4 }}>
          TOKYO & KYOTO · MAR 12–26
        </p>
        <h1 style={{ fontSize: 28, color: 'var(--text-primary)' }}>Budget</h1>
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        {/* Total overview */}
        <div className="card" style={{ background: 'var(--text-primary)', marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 12, color: 'rgba(250,246,240,0.6)', marginBottom: 4, letterSpacing: 0.5 }}>TOTAL SPENT</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: 'var(--cream)', fontWeight: 700 }}>
                ${budget.spent.toLocaleString()}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 12, color: 'rgba(250,246,240,0.6)', marginBottom: 2 }}>of ${budget.total.toLocaleString()}</p>
              <p style={{ fontSize: 20, color: 'var(--sand)', fontWeight: 600 }}>{pct}%</p>
            </div>
          </div>

          <div style={{ height: 10, background: 'rgba(255,255,255,0.15)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99,
              background: pct > 85 ? '#e07070' : 'var(--brown-light)',
              width: `${pct}%`,
              transition: 'width 0.8s ease',
            }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            <p style={{ fontSize: 12, color: 'rgba(250,246,240,0.5)' }}>
              ${remaining.toLocaleString()} remaining
            </p>
            <p style={{ fontSize: 12, color: 'rgba(250,246,240,0.5)' }}>
              ~${perPerson}/person
            </p>
          </div>
        </div>

        {/* Spending by category */}
        <div className="card" style={{ marginBottom: 14 }}>
          <div className="section-header">
            <h2 className="section-title">By Category</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {budget.categories.map(cat => {
              const catPct = Math.round((cat.spent / cat.budget) * 100);
              return (
                <div key={cat.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{cat.name}</span>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                        ${cat.spent.toLocaleString()}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}> / ${cat.budget.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.min(catPct, 100)}%`,
                        background: cat.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Per person split */}
        <div className="card">
          <div className="section-header">
            <h2 className="section-title">Per Person</h2>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>fair share: ${perPerson}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {budget.splits.map(person => (
              <PersonSplit key={person.name} person={person} fairShare={perPerson} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonSplit({ person, fairShare }) {
  const isOwing = person.owes > 0;
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 14px',
      background: 'var(--cream)',
      borderRadius: 'var(--radius-sm)',
    }}>
      <div className="avatar" style={{ background: person.color }}>
        {person.name[0]}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{person.name}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
            paid ${person.paid.toLocaleString()}
          </span>
        </div>
        {isOwing ? (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: '#fde8e8', color: '#9d3d3d',
            padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500,
          }}>
            owes ${person.owes} to Marina
          </div>
        ) : (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: '#e8f5e8', color: '#3d7a45',
            padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500,
          }}>
            ✓ All settled
          </div>
        )}
      </div>
    </div>
  );
}
