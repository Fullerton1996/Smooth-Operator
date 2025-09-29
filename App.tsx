import React, { useState } from 'react';
import Header from './components/Header';
import LevelManager from './components/LevelManager';
import SpotifyPlayer from './components/SpotifyPlayer';
import IntroSection from './components/IntroSection';
import FreestyleMode from './components/FreestyleMode';

const App: React.FC = () => {
  const [isFreestyleMode, setIsFreestyleMode] = useState(false);

  return (
    <div className="min-h-screen text-stone-900 font-sans">
      <Header />
      <IntroSection />
      
      {/* Mode Toggle */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsFreestyleMode(false)}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              !isFreestyleMode 
                ? 'bg-stone-800 text-white shadow-lg' 
                : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
            }`}
          >
            📚 Learning Mode
          </button>
          <button
            onClick={() => setIsFreestyleMode(true)}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              isFreestyleMode 
                ? 'bg-stone-800 text-white shadow-lg' 
                : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
            }`}
          >
            🎯 Freestyle Mode
          </button>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {isFreestyleMode ? <FreestyleMode /> : <LevelManager />}
        
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
