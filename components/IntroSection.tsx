import React, { useState, useEffect } from 'react';
import SpotifyPlayer from './SpotifyPlayer';

const IntroSection: React.FC = () => {
  const [currentText, setCurrentText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const introText = "Master the art of cubic bezier curves. Create smooth, natural animations that bring your designs to life. From subtle micro-interactions to bold transitions, every curve tells a story.";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < introText.length) {
        setCurrentText(introText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setIsComplete(true);
      }
    }, 30);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-8 mb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-gradient-to-r from-stone-100 to-stone-50 rounded-2xl p-8 shadow-sm border border-stone-200 mb-8">
          <p className="text-lg md:text-xl text-stone-700 leading-relaxed text-center">
            {currentText}
            {!isComplete && (
              <span className="animate-pulse text-stone-400">|</span>
            )}
          </p>
        </div>
        
        {/* Spotify Player Section */}
        <div className="text-center">
          <SpotifyPlayer 
            playlistId="1ykXm5n2MJNcbRcj48X34k"
            className="max-w-4xl mx-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default IntroSection;