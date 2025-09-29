import React from 'react';
import SpotifyPlayer from './SpotifyPlayer';

const IntroSection: React.FC = () => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <SpotifyPlayer 
        playlistId="1ykXm5n2MJNcbRcj48X34k"
        className=""
      />
    </div>
  );
};

export default IntroSection;