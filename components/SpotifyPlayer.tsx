import React from 'react';

interface SpotifyPlayerProps {
  playlistId: string;
  className?: string;
}

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({ 
  playlistId, 
  className = "" 
}) => {
  return (
    <div className={`spotify-player ${className}`}>
      {/* Just the Embedded Spotify Player */}
      <iframe
        src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0&autoplay=1&height=352`}
        width="100%"
        height="352"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-lg max-w-sm mx-auto"
      />
    </div>
  );
};

export default SpotifyPlayer;