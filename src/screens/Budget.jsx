import { useState } from 'react';
import { useBudget } from '../hooks/useBudget';
import LoadingState from '../components/LoadingState';

export default function Budget({ tripId, tripName, tripDates }) {
  const {
    totalBudget, totalSpent, remaining, pct,
    categories, members, memberCount, perPerson,
    loading, error, hasItems, hasBudget,
    updateTotalBudget,
  } = useBudget(tripId);

  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput,   setBudgetInput]   = useState('');
  const [savingBudget,  setSavingBudget]  = useState(false);

  const startEditBudget = () => {
    setBudgetInput(totalBudget > 0 ? String(totalBudget) : '');
    setEditingBudget(true);
  };

  const saveBudget = async () => {
    const val = Number(budgetInput);
    if (!budgetInput || isNaN(val) || val < 0) return;
    setSavingBudget(true);
    try {
      await updateTotalBudget(val);
      setEditingBudget(false);
    } catch (e) {
      alert(e.message);
    } finally {
      setSavingBudget(false);
    }
  };

  const barColor = pct >= 100 ? '#c0392b' : pct >= 90 ? '#c0392b' : pct >= 70 ? '#d4865a' : '#5a9e6f';

  if (loading) return <div className="screen"><LoadingState message="Loading budget…" /></div>;
  if (error)   return <div className="screen" style={{ padding: 24, color: 'var(--brown)' }}>{error}</div>;

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ padding: '52px 24px 20px', background: 'var(--cream)' }}>
        <p style={{ fontSize: 12, color: 'var(--brown)', fontWeight: 500, letterSpacing: 0.8, marginBottom: 4 }}>
          {tripName ?? 'TRIP'}{tripDates ? ` · ${tripDates}` : ''}
        </p>
        <h1 style={{ fontSize: 28, color: 'var(--text-primary)' }}>Budget</h1>
      </div>

      <div style={{ padding: '0 16px 80px' }}>

        {/* Overview card */}
        <div className="card" style={{ background: 'var(--text-primary)', marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 11, color: 'rgba(250,246,240,0.55)', marginBottom: 4, letterSpacing: 0.6, textTransform: 'uppercase' }}>
                Total Spent
              </p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, color: 'var(--cream)', fontWeight: 700, lineHeight: 1 }}>
                ${totalSpent.toLocaleString()}
              </p>
            </div>

            {/* Budget target */}
            <div style={{ textAlign: 'right' }}>
              {editingBudget ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14, color: 'rgba(250,246,240,0.7)' }}>$</span>
                  <input
                    type="number"
                    min={0}
                    autoFocus
                    value={budgetInput}
                    onChange={e => setBudgetInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') saveBudget(); if (e.key === 'Escape') setEditingBudget(false); }}
                    style={{
                      width: 100, padding: '6px 10px',
                      background: 'rgba(255,255,255,0.12)',
                      border: '1.5px solid rgba(255,255,255,0.3)',
                      borderRadius: 8, color: 'var(--cream)',
                      fontSize: 15, fontFamily: 'Inter, sans-serif',
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={saveBudget}
                    disabled={savingBudget}
                    style={{
                      padding: '6px 12px',
                      background: 'var(--brown-light)', color: 'var(--cream)',
                      border: 'none', borderRadius: 8,
                      fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    {savingBudget ? '…' : 'Save'}
                  </button>
                </div>
              ) : hasBudget ? (
                <>
                  <p style={{ fontSize: 12, color: 'rgba(250,246,240,0.55)', marginBottom: 2 }}>
                    of ${totalBudget.toLocaleString()}
                  </p>
                  <button
                    onClick={startEditBudget}
                    style={{
                      background: 'transparent', border: 'none',
                      color: 'rgba(250,246,240,0.5)', fontSize: 12,
                      cursor: 'pointer', padding: 0, marginTop: 2,
                    }}
                  >
                    edit budget ✎
                  </button>
                </>
              ) : (
                <button
                  onClick={startEditBudget}
                  style={{
                    padding: '8px 14px',
                    background: 'rgba(255,255,255,0.12)',
                    border: '1.5px solid rgba(255,255,255,0.25)',
                    borderRadius: 10, color: 'var(--cream)',
                    fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  }}
                >
                  Set budget
                </button>
              )}
            </div>
          </div>

          {/* Progress bar */}
          {hasBudget && (
            <>
              <div style={{ height: 10, background: 'rgba(255,255,255,0.15)', borderRadius: 99, overflow: 'hidden', marginBottom: 10 }}>
                <div style={{
                  height: '100%', borderRadius: 99,
                  background: barColor,
                  width: `${Math.min(pct, 100)}%`,
                  transition: 'width 0.8s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontSize: 12, color: 'rgba(250,246,240,0.55)' }}>
                  {pct}% used · {remaining >= 0 ? `$${remaining.toLocaleString()} remaining` : `$${Math.abs(remaining).toLocaleString()} over budget`}
                </p>
              </div>
            </>
          )}

          {/* No budget set — just show item count */}
          {!hasBudget && hasItems && (
            <p style={{ fontSize: 12, color: 'rgba(250,246,240,0.45)', marginTop: 4 }}>
              {categories.length} categor{categories.length === 1 ? 'y' : 'ies'} · set a budget to track progress
            </p>
          )}
        </div>

        {/* Empty state */}
        {!hasItems ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>🧾</p>
            <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>No costs tracked yet</p>
            <p style={{ fontSize: 13 }}>Add activities with costs in the Itinerary tab and they'll appear here automatically.</p>
          </div>
        ) : (
          <>
            {/* By Activity */}
            <div className="card" style={{ marginBottom: 14 }}>
              <h2 className="section-title" style={{ marginBottom: 16 }}>By Activity</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {categories.map(cat => (
                  <div key={cat.type}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>
                        {cat.label}
                      </span>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                          ${cat.total.toLocaleString()}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>
                          {cat.sharePct}%
                        </span>
                      </div>
                    </div>
                    <div style={{ height: 8, background: 'var(--cream-dark)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 99,
                        background: cat.color,
                        width: `${cat.sharePct}%`,
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Per Person Split */}
            {memberCount > 0 && (
              <div className="card">
                <h2 className="section-title" style={{ marginBottom: 4 }}>Per Person Split</h2>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
                  Equal split across {memberCount} member{memberCount !== 1 ? 's' : ''}
                </p>

                <div style={{
                  textAlign: 'center',
                  padding: '16px 0 20px',
                  borderBottom: '1px solid var(--border)',
                  marginBottom: 16,
                }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: 'var(--text-primary)' }}>
                    ${Math.round(perPerson).toLocaleString()}
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>each</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {members.map(m => {
                    const name = m.profile?.name ?? m.profile?.email ?? 'Member';
                    return (
                      <div key={m.user_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: '50%',
                            background: 'var(--cream-dark)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 13, fontWeight: 600, color: 'var(--brown)',
                            flexShrink: 0,
                          }}>
                            {name[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{name}</p>
                            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.role ?? 'Member'}</p>
                          </div>
                        </div>
                        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--brown-dark)' }}>
                          ${Math.round(perPerson).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
