import React from 'react';
import Header from './components/Header';
import LevelManager from './components/LevelManager';

const App: React.FC = () => {
  return (
    <div className="min-h-screen text-stone-900 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <LevelManager />
      </main>
      <footer className="text-center py-6">
        <a
          href="https://open.spotify.com/playlist/1ykXm5n2MJNcbRcj48X34k?si=57509f32f9674e5f"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-stone-200 text-stone-800 font-bold py-3 px-6 rounded-full hover:bg-stone-300 hover:text-black transition-all duration-200 text-base shadow-sm"
        >
          Smooth Operator Playlist 🎵
        </a>
      </footer>
    </div>
  );
};

export default App;
