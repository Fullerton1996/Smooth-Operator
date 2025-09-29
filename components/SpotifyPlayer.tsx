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
      {/* Title */}
      <div className="mb-4">
        <h1 className="text-lg text-stone-700 text-center">Hand selected playlist to ease you through.</h1>
      </div>

      {/* Always Visible Embedded Spotify Player */}
      <div className="p-4 bg-black/5 rounded-xl shadow-inner">
        <div className="relative w-full" style={{ paddingBottom: '380px' }}>
          <iframe
            src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
            width="100%"
            height="380"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="absolute top-0 left-0 w-full h-full rounded-lg"
          />
        </div>

      </div>
    </div>
  );
};

export default SpotifyPlayer;