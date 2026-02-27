export default function BottomNav({ active, onNav, onHome }) {
  const items = [
    {
      id: 'itinerary',
      label: 'Itinerary',
      icon: (active) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="3" />
          <path d="M8 2v4M16 2v4M3 10h18" />
          <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
        </svg>
      ),
    },
    {
      id: 'budget',
      label: 'Budget',
      icon: (active) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 6v2M12 16v2M9.5 9.5c0-1.1.9-1.5 2.5-1.5s2.5.9 2.5 2-.9 1.5-2.5 2-2.5.9-2.5 2 .9 2 2.5 2 2.5-.4 2.5-1.5" />
        </svg>
      ),
    },
    {
      id: 'home',
      label: '',
      isHome: true,
      icon: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 26, height: 26 }}>
          <path d="M10.707 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 19 11h-1v9a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-9H5a1 1 0 0 1-.707-1.707l7-7Z"/>
        </svg>
      ),
    },
    {
      id: 'pals',
      label: 'Pals',
      icon: (active) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="7" r="4" />
          <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.87" />
        </svg>
      ),
    },
    {
      id: 'packing',
      label: 'Packing',
      icon: (active) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="15" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="bottom-nav">
      {items.map(item => {
        if (item.isHome) {
          return (
            <button
              key="home"
              className="nav-item"
              onClick={onHome}
              style={{ position: 'relative', top: -8 }}
            >
              <div style={{
                width: 52, height: 52,
                borderRadius: '50%',
                background: active === 'home' ? 'var(--text-primary)' : 'var(--brown-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                color: 'white',
              }}>
                {item.icon()}
              </div>
            </button>
          );
        }
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onNav(item.id)}
          >
            {item.icon(isActive)}
            <span className="nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
