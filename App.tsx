import React from 'react';
import Header from './components/Header';
import LevelManager from './components/LevelManager';
import SpotifyPlayer from './components/SpotifyPlayer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen text-stone-900 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <LevelManager />
        
        {/* Spotify Player Section */}
        <section className="mt-12 text-center">
          <SpotifyPlayer 
            playlistId="1ykXm5n2MJNcbRcj48X34k"
            className="max-w-md mx-auto"
          />
        </section>
      </main>
      <footer className="text-center py-6">
        <p className="text-stone-600 text-sm">
          Craft smooth animations with the perfect soundtrack ✨
        </p>
      </footer>
    </div>
  );
};

export default App;
