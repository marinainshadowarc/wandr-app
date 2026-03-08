// v1.1.0
import { useState } from 'react';
import EarthSticker from './components/EarthSticker';
import { AuthProvider, useAuth } from './context/AuthContext';
import BottomNav from './components/BottomNav';
import Home from './screens/Home';
import Itinerary from './screens/Itinerary';
import Budget from './screens/Budget';
import Packing from './screens/Packing';
import Pals from './screens/Pals';
import Login from './screens/Login';
import Signup from './screens/Signup';

function AppShell() {
  const { session, signOut } = useAuth();
  const [screen, setScreen] = useState('home');
  const [authView, setAuthView] = useState('login');
  const [activeTrip, setActiveTrip] = useState(null);

  // Loading session
  if (session === undefined) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #e8d5b7 0%, #faf6f0 55%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 12,
      }}>
        <EarthSticker size={40} />
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: 'var(--text-muted)' }}>
          Loading…
        </p>
      </div>
    );
  }

  // Not logged in
  if (!session) {
    return authView === 'login'
      ? <Login onSwitch={() => setAuthView('signup')} />
      : <Signup onSwitch={() => setAuthView('login')} />;
  }

  const handleTripSelect = (trip) => {
    setActiveTrip(trip);
    setScreen('itinerary');
  };

  const formatTripDates = (trip) => {
    const fmt = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (trip.start_date && trip.end_date) return `${fmt(trip.start_date)} – ${fmt(trip.end_date)}`;
    if (trip.start_date) return fmt(trip.start_date);
    return '';
  };

  const tripProps = activeTrip ? {
    tripId: activeTrip.id,
    tripName: activeTrip.name?.toUpperCase(),
    tripDates: formatTripDates(activeTrip),
  } : {};

  const renderScreen = () => {
    switch (screen) {
      case 'home':      return <Home onTripSelect={handleTripSelect} onSignOut={signOut} />;
      case 'itinerary': return <Itinerary {...tripProps} />;
      case 'budget':    return <Budget {...tripProps} />;
      case 'packing':   return <Packing {...tripProps} />;
      case 'pals':      return <Pals {...tripProps} />;
      default:          return <Home onTripSelect={handleTripSelect} onSignOut={signOut} />;
    }
  };

  return (
    <div className="app-shell">
      {renderScreen()}
      <BottomNav active={screen} onNav={setScreen} onHome={() => setScreen('home')} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
