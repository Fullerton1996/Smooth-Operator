import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [titleVisible, setTitleVisible] = useState('');
  const [subtitleVisible, setSubtitleVisible] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  const title = "Smooth Operator";
  const subtitle = "Easing you into easing.";

  useEffect(() => {
    // Title typing animation
    let titleIndex = 0;
    const titleTimer = setInterval(() => {
      if (titleIndex < title.length) {
        setTitleVisible(title.slice(0, titleIndex + 1));
        titleIndex++;
      } else {
        clearInterval(titleTimer);
        // Start subtitle animation after a brief pause
        setTimeout(() => {
          let subtitleIndex = 0;
          const subtitleTimer = setInterval(() => {
            if (subtitleIndex < subtitle.length) {
              setSubtitleVisible(subtitle.slice(0, subtitleIndex + 1));
              subtitleIndex++;
            } else {
              clearInterval(subtitleTimer);
              // Stop cursor after animation completes
              setTimeout(() => setShowCursor(false), 1000);
            }
          }, 50);
        }, 300);
      }
    }, 80);

    // Cursor blinking
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(titleTimer);
      clearInterval(cursorTimer);
    };
  }, []);

  return (
    <header className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-7xl md:text-8xl font-bold tracking-tight text-black mb-4">
          {titleVisible}
          {titleVisible.length < title.length && showCursor && (
            <span className="animate-pulse">|</span>
          )}
        </h1>
        <p className="text-2xl md:text-3xl text-stone-600 font-medium">
          {subtitleVisible}
          {subtitleVisible.length > 0 && subtitleVisible.length < subtitle.length && showCursor && (
            <span className="animate-pulse">|</span>
          )}
        </p>
      </div>
    </header>
  );
};

export default Header;