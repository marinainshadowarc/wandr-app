import { useBudget } from '../hooks/useBudget';
import LoadingState from '../components/LoadingState';

export default function Budget({ tripId, tripName, tripDates }) {
  const { budget, loading, error } = useBudget(tripId);

  if (loading) return <div className="screen"><LoadingState message="Loading budget…" /></div>;
  if (error)   return <div className="screen" style={{ padding: 24, color: 'var(--brown)' }}>{error}</div>;
  if (!budget) return (
    <div className="screen">
      <div style={{ padding: '52px 24px 20px' }}>
        <h1 style={{ fontSize: 28 }}>Budget</h1>
      </div>
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: 28, marginBottom: 8 }}>💰</p>
        <p>No budget entries yet.</p>
      </div>
    </div>
  );

  const pct = budget.total > 0 ? Math.round((budget.spent / budget.total) * 100) : 0;
  const remaining = budget.total - budget.spent;

  return (
    <div className="screen">
      <div style={{ padding: '52px 24px 20px', background: 'var(--cream)' }}>
        <p style={{ fontSize: 12, color: 'var(--brown)', fontWeight: 500, letterSpacing: 0.8, marginBottom: 4 }}>
          {tripName ?? 'TRIP'}{tripDates ? ` · ${tripDates}` : ''}
        </p>
        <h1 style={{ fontSize: 28, color: 'var(--text-primary)' }}>Budget</h1>
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        {/* Total overview */}
        <div className="card" style={{ background: 'var(--text-primary)', marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 12, color: 'rgba(250,246,240,0.6)', marginBottom: 4, letterSpacing: 0.5 }}>
                TOTAL SPENT
              </p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: 'var(--cream)', fontWeight: 700 }}>
                ${budget.spent.toLocaleString()}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 12, color: 'rgba(250,246,240,0.6)', marginBottom: 2 }}>
                of ${budget.total.toLocaleString()}
              </p>
              <p style={{ fontSize: 20, color: 'var(--sand)', fontWeight: 600 }}>{pct}%</p>
            </div>
          </div>

          <div style={{ height: 10, background: 'rgba(255,255,255,0.15)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99,
              background: pct > 85 ? '#e07070' : 'var(--brown-light)',
              width: `${pct}%`, transition: 'width 0.8s ease',
            }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            <p style={{ fontSize: 12, color: 'rgba(250,246,240,0.5)' }}>
              ${remaining.toLocaleString()} remaining
            </p>
            <p style={{ fontSize: 12, color: 'rgba(250,246,240,0.5)' }}>
              {budget.categories.length} categories
            </p>
          </div>
        </div>

        {/* By category */}
        <div className="card">
          <div className="section-header">
            <h2 className="section-title">By Category</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {budget.categories.map(cat => {
              const catPct = cat.totalBudget > 0
                ? Math.round((cat.totalSpent / cat.totalBudget) * 100)
                : 0;
              return (
                <div key={cat.category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>
                      {cat.category}
                    </span>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                        ${cat.totalSpent.toLocaleString()}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {' '}/ ${cat.totalBudget.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${Math.min(catPct, 100)}%`, background: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
