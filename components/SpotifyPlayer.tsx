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
      {/* Realistic Spotify Mini Player */}
      <div className="bg-black rounded-xl p-4 max-w-sm mx-auto shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          {/* Album Art */}
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-medium truncate">Moonracer</div>
            <div className="text-gray-400 text-xs truncate">Tommy Wraight</div>
          </div>
          {/* Spotify Logo */}
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
        </div>
        
        {/* Play Controls */}
        <div className="flex items-center justify-center gap-4">
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm10 0h2v12h-2z"/>
            </svg>
          </button>
          <a 
            href={`https://open.spotify.com/playlist/${playlistId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-full w-8 h-8 flex items-center justify-center hover:scale-105 transition-transform"
          >
            <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </a>
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpotifyPlayer;