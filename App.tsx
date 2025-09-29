import React from 'react';
import Header from './components/Header';
import LevelManager from './components/LevelManager';
import IntroSection from './components/IntroSection';

const App: React.FC = () => {
  return (
    <div className="text-stone-900 font-sans">
      <Header />
      
      <IntroSection />

      <main className="container mx-auto px-4 py-8">
        <LevelManager />
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
