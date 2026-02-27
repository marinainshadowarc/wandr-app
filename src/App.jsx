import { useState } from 'react';
import BottomNav from './components/BottomNav';
import Home from './screens/Home';
import Itinerary from './screens/Itinerary';
import Budget from './screens/Budget';
import Packing from './screens/Packing';
import Pals from './screens/Pals';

export default function App() {
  const [screen, setScreen] = useState('home');

  const renderScreen = () => {
    switch (screen) {
      case 'home':      return <Home onTripSelect={() => setScreen('itinerary')} />;
      case 'itinerary': return <Itinerary />;
      case 'budget':    return <Budget />;
      case 'packing':   return <Packing />;
      case 'pals':      return <Pals />;
      default:          return <Home onTripSelect={() => setScreen('itinerary')} />;
    }
  };

  return (
    <div className="app-shell">
      {renderScreen()}
      <BottomNav
        active={screen}
        onNav={setScreen}
        onHome={() => setScreen('home')}
      />
    </div>
  );
}
