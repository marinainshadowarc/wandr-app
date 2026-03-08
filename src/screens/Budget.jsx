import { useState } from 'react';
import { useBudget } from '../hooks/useBudget';
import LoadingState from '../components/LoadingState';
import NewExpenseModal from '../components/NewExpenseModal';

const CAT_EMOJIS = {
  Flights: '✈', Accommodation: '🏨', Food: '🍜',
  Activities: '🎯', Transport: '🚆', Shopping: '🛍️', Other: '💳',
};

export default function Budget({ tripId, tripName, tripDates }) {
  const { budget, loading, error, members, addExpense, deleteExpense } = useBudget(tripId);
  const [showModal,  setShowModal]  = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try { await deleteExpense(id); }
    catch (e) { alert(e.message); }
    finally { setDeletingId(null); }
  };

  const handleSave = async (data) => {
    await addExpense(data);
    setShowModal(false);
  };

  if (loading) return <div className="screen"><LoadingState message="Loading budget…" /></div>;
  if (error)   return <div className="screen" style={{ padding: 24, color: 'var(--brown)' }}>{error}</div>;

  const pct       = budget?.total > 0 ? Math.round((budget.spent / budget.total) * 100) : 0;
  const remaining = budget ? budget.total - budget.spent : 0;

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ padding: '52px 24px 20px', background: 'var(--cream)' }}>
        <p style={{ fontSize: 12, color: 'var(--brown)', fontWeight: 500, letterSpacing: 0.8, marginBottom: 4 }}>
          {tripName ?? 'TRIP'}{tripDates ? ` · ${tripDates}` : ''}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: 28, color: 'var(--text-primary)' }}>Budget</h1>
          <button
            onClick={() => setShowModal(true)}
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

      {!budget ? (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: 28, marginBottom: 8 }}>💰</p>
          <p style={{ marginBottom: 20 }}>No expenses yet.</p>
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: '12px 28px',
              background: 'var(--text-primary)', color: 'var(--cream)',
              border: 'none', borderRadius: 'var(--radius)',
              fontFamily: "'Playfair Display', serif",
              fontSize: 15, fontWeight: 600, cursor: 'pointer',
            }}
          >
            + Add first expense
          </button>
        </div>
      ) : (
        <div style={{ padding: '0 16px 80px' }}>

          {/* Overview card */}
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
                {budget.total > 0 && (
                  <p style={{ fontSize: 12, color: 'rgba(250,246,240,0.6)', marginBottom: 2 }}>
                    of ${budget.total.toLocaleString()}
                  </p>
                )}
                <p style={{ fontSize: 20, color: 'var(--sand)', fontWeight: 600 }}>
                  {budget.total > 0 ? `${pct}%` : `${budget.rows.length} expenses`}
                </p>
              </div>
            </div>

            {budget.total > 0 && (
              <>
                <div style={{ height: 10, background: 'rgba(255,255,255,0.15)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 99,
                    background: pct > 85 ? '#e07070' : 'var(--brown-light)',
                    width: `${Math.min(pct, 100)}%`, transition: 'width 0.8s ease',
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
              </>
            )}
          </div>

          {/* By Category */}
          <div className="card" style={{ marginBottom: 14 }}>
            <div className="section-header">
              <h2 className="section-title">By Category</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {budget.categories.map(cat => {
                const catPct = cat.totalBudget > 0
                  ? Math.round((cat.totalSpent / cat.totalBudget) * 100)
                  : 100;
                return (
                  <div key={cat.category}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>
                        {CAT_EMOJIS[cat.category] ?? '💳'} {cat.category}
                      </span>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                          ${cat.totalSpent.toLocaleString()}
                        </span>
                        {cat.totalBudget > 0 && (
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            {' '}/ ${cat.totalBudget.toLocaleString()}
                          </span>
                        )}
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

          {/* Who paid what */}
          {budget.paidByBreakdown.length > 0 && (
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="section-header">
                <h2 className="section-title">Who paid what</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {budget.paidByBreakdown.map(p => (
                  <div key={p.profileId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'var(--cream-dark)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 600, color: 'var(--brown)',
                      }}>
                        {p.name[0]?.toUpperCase()}
                      </div>
                      <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{p.name}</span>
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--brown-dark)' }}>
                      ${p.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Expenses */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">All Expenses</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {budget.rows.map((row, idx) => (
                <ExpenseRow
                  key={row.id}
                  row={row}
                  members={members}
                  isLast={idx === budget.rows.length - 1}
                  deleting={deletingId === row.id}
                  onDelete={() => handleDelete(row.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <NewExpenseModal
          members={members}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

function ExpenseRow({ row, members, isLast, deleting, onDelete }) {
  const paidBy = members.find(m => m.user_id === row.paid_by);
  const paidByName = paidBy?.profile?.name ?? null;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 0',
      borderBottom: isLast ? 'none' : '1px solid var(--border)',
      opacity: deleting ? 0.4 : 1, transition: 'opacity 0.2s',
    }}>
      {/* Category dot */}
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: 'var(--cream-dark)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16,
      }}>
        {CAT_EMOJIS[row.category] ?? '💳'}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
          {row.description || row.category}
        </p>
        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          {row.category}{paidByName ? ` · ${paidByName}` : ''}
        </p>
      </div>

      {/* Amount */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--brown-dark)' }}>
          {row.currency ?? 'AUD'} {Number(row.spent_amount).toLocaleString()}
        </p>
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        disabled={deleting}
        style={{
          flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
          background: 'var(--cream-dark)', border: 'none',
          cursor: deleting ? 'default' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, color: 'var(--text-muted)',
        }}
      >
        ×
      </button>
    </div>
  );
}
