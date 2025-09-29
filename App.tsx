import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import LevelManager from './components/LevelManager';
import IntroSection from './components/IntroSection';

const App: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const introSectionHeight = windowHeight * 1.5; // Approximate height of hero + intro sections
      
      // Calculate progress from 0 to 1 based on scroll through intro sections
      const progress = Math.min(scrollTop / introSectionHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Interpolate between the grayish color and white
  const backgroundColor = `rgb(${231 + (255 - 231) * scrollProgress}, ${228 + (255 - 228) * scrollProgress}, ${225 + (255 - 225) * scrollProgress})`;

  return (
    <div 
      className="text-stone-900 font-sans min-h-screen transition-colors duration-100"
      style={{ backgroundColor }}
    >
      <Header />
      
      <IntroSection />

      <main className="container mx-auto px-4 py-8">
        <LevelManager />
      </main>
      <footer className="py-16">
      </footer>
    </div>
  );
};

export default App;
