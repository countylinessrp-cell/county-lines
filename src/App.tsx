import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import TeamSection from './components/TeamSection';
import WhitelistForm from './components/WhitelistForm';
import ServerUpdates from './components/ServerUpdates';
import Footer from './components/Footer';

function App() {
  const [serverStatus, setServerStatus] = useState({
    online: true,
    players: 32,
    maxPlayers: 64,
  });

  useEffect(() => {
    const updateServerStatus = () => {
      setServerStatus({
        online: Math.random() > 0.1,
        players: Math.floor(Math.random() * 64),
        maxPlayers: 64,
      });
    };

    const interval = setInterval(updateServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      <div className="pt-16">
        <Hero serverStatus={serverStatus} />
        <TeamSection />
        <WhitelistForm />
        <ServerUpdates />
        <Footer />
      </div>
    </div>
  );
}

export default App;
