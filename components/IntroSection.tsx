import React from 'react';
import SpotifyPlayer from './SpotifyPlayer';

const IntroSection: React.FC = () => {
  const introText = "Master the art of cubic bezier curves. Create smooth, natural animations that bring your designs to life. From subtle micro-interactions to bold transitions, every curve tells a story.";

  return (
    <section className="py-8 mb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-gradient-to-r from-stone-100 to-stone-50 rounded-2xl p-8 shadow-sm border border-stone-200">
          {/* Title with Mini Spotify Player */}
          <div className="text-center mb-8">
            <h1 className="text-lg text-stone-700 mb-4">Hand selected playlist to ease you through.</h1>
            <SpotifyPlayer 
              playlistId="1ykXm5n2MJNcbRcj48X34k"
              className=""
            />
          </div>
          
          <p className="text-lg md:text-xl text-stone-700 leading-relaxed text-center">
            {introText}
          </p>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;