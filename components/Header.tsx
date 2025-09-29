import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCircle {
  id: number;
  x: number;
  y: number;
  vx: number; // velocity x
  vy: number; // velocity y
  radius: number;
  color: string;
  opacity: number;
  speed: number;
  direction: number; // angle in radians
  changeDirectionTimer: number;
}

const Header: React.FC = () => {
  const [titleVisible, setTitleVisible] = useState('');
  const [subtitleVisible, setSubtitleVisible] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [circles, setCircles] = useState<AnimatedCircle[]>([]);
  const animationRef = useRef<number>();
  const containerRef = useRef<HTMLElement>(null);

  const title = "Smooth Operator";
  const subtitle = "Easing you into easing.";
  
  // Professional color palette
  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

  useEffect(() => {
    // Title typing animation
    let titleIndex = 0;
    const titleTimer = setInterval(() => {
      if (titleIndex < title.length) {
        setTitleVisible(title.slice(0, titleIndex + 1));
        titleIndex++;
      } else {
        clearInterval(titleTimer);
        setTimeout(() => {
          let subtitleIndex = 0;
          const subtitleTimer = setInterval(() => {
            if (subtitleIndex < subtitle.length) {
              setSubtitleVisible(subtitle.slice(0, subtitleIndex + 1));
              subtitleIndex++;
            } else {
              clearInterval(subtitleTimer);
              setTimeout(() => setShowCursor(false), 1000);
            }
          }, 50);
        }, 300);
      }
    }, 80);

    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    // Initialize animated circles with continuous movement
    const headerHeight = window.innerHeight;
    const initialCircles: AnimatedCircle[] = colors.map((color, index) => {
      const startX = Math.random() * (window.innerWidth - 200) + 100;
      const startY = Math.random() * (headerHeight - 200) + 100;
      const direction = Math.random() * Math.PI * 2; // Random initial direction
      const speed = 0.5 + Math.random() * 2; // Speed between 0.5-2.5
      return {
        id: index,
        x: startX,
        y: startY,
        vx: Math.cos(direction) * speed,
        vy: Math.sin(direction) * speed,
        radius: 15 + Math.random() * 25, // Varied sizes 15-40px
        color,
        opacity: 0.4 + Math.random() * 0.4, // 0.4-0.8 opacity
        speed,
        direction,
        changeDirectionTimer: Math.random() * 300 // Random timer for direction changes
      };
    });

    setCircles(initialCircles);

    return () => {
      clearInterval(titleTimer);
      clearInterval(cursorTimer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Continuous smooth animation
  useEffect(() => {
    const animate = () => {
      setCircles(prevCircles => {
        const headerHeight = window.innerHeight;
        
        return prevCircles.map(circle => {
          let newCircle = { ...circle };
          
          // Update position based on velocity
          newCircle.x += newCircle.vx;
          newCircle.y += newCircle.vy;
          
          // Bounce off boundaries with smooth direction changes
          if (newCircle.x <= newCircle.radius || newCircle.x >= window.innerWidth - newCircle.radius) {
            newCircle.vx *= -1;
            newCircle.x = Math.max(newCircle.radius, Math.min(window.innerWidth - newCircle.radius, newCircle.x));
            // Add slight randomness to bounce direction
            newCircle.vy += (Math.random() - 0.5) * 0.5;
          }
          
          if (newCircle.y <= newCircle.radius || newCircle.y >= headerHeight - newCircle.radius) {
            newCircle.vy *= -1;
            newCircle.y = Math.max(newCircle.radius, Math.min(headerHeight - newCircle.radius, newCircle.y));
            // Add slight randomness to bounce direction
            newCircle.vx += (Math.random() - 0.5) * 0.5;
          }
          
          // Randomly change direction occasionally for more organic movement
          newCircle.changeDirectionTimer--;
          if (newCircle.changeDirectionTimer <= 0) {
            const newDirection = newCircle.direction + (Math.random() - 0.5) * 0.5; // Slight direction change
            newCircle.vx = Math.cos(newDirection) * newCircle.speed;
            newCircle.vy = Math.sin(newDirection) * newCircle.speed;
            newCircle.direction = newDirection;
            newCircle.changeDirectionTimer = 200 + Math.random() * 300; // Reset timer
          }
          
          // Keep velocity within speed limits
          const currentSpeed = Math.sqrt(newCircle.vx * newCircle.vx + newCircle.vy * newCircle.vy);
          if (currentSpeed > newCircle.speed * 1.5) {
            newCircle.vx = (newCircle.vx / currentSpeed) * newCircle.speed;
            newCircle.vy = (newCircle.vy / currentSpeed) * newCircle.speed;
          }
          
          return newCircle;
        });
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // No interaction needed for ambient circles

  return (
    <header 
      ref={containerRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Animated Circles */}
      {circles.map(circle => (
        <div
          key={circle.id}
          className="absolute pointer-events-none"
          style={{
            left: circle.x - circle.radius,
            top: circle.y - circle.radius,
            width: circle.radius * 2,
            height: circle.radius * 2,
            borderRadius: '50%',
            backgroundColor: circle.color,
            opacity: circle.opacity,
            filter: 'blur(0.5px)',
            transition: 'opacity 0.3s ease-in-out'
          }}
        />
      ))}

      {/* Text Content */}
      <div className="container mx-auto px-4 text-center relative z-10">
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