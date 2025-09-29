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
  
  // Extended professional color palette
  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316', '#84CC16', '#A855F7', '#E11D48', '#059669'];

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

  // Continuous smooth animation with collision detection
  useEffect(() => {
    const animate = () => {
      setCircles(prevCircles => {
        const headerHeight = window.innerHeight;
        let newCircles = prevCircles.map(circle => ({ ...circle }));
        
        // Update positions
        newCircles.forEach(circle => {
          circle.x += circle.vx;
          circle.y += circle.vy;
        });
        
        // Handle wall collisions
        newCircles.forEach(circle => {
          // Bounce off left/right walls
          if (circle.x <= circle.radius || circle.x >= window.innerWidth - circle.radius) {
            circle.vx *= -1;
            circle.x = Math.max(circle.radius, Math.min(window.innerWidth - circle.radius, circle.x));
          }
          
          // Bounce off top/bottom walls
          if (circle.y <= circle.radius || circle.y >= headerHeight - circle.radius) {
            circle.vy *= -1;
            circle.y = Math.max(circle.radius, Math.min(headerHeight - circle.radius, circle.y));
          }
        });
        
        // Handle circle-to-circle collisions
        for (let i = 0; i < newCircles.length; i++) {
          for (let j = i + 1; j < newCircles.length; j++) {
            const circle1 = newCircles[i];
            const circle2 = newCircles[j];
            
            const dx = circle2.x - circle1.x;
            const dy = circle2.y - circle1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = circle1.radius + circle2.radius;
            
            if (distance < minDistance) {
              // Collision detected - elastic collision
              const angle = Math.atan2(dy, dx);
              const sin = Math.sin(angle);
              const cos = Math.cos(angle);
              
              // Separate circles to prevent overlap
              const overlap = (minDistance - distance) / 2;
              circle1.x -= overlap * cos;
              circle1.y -= overlap * sin;
              circle2.x += overlap * cos;
              circle2.y += overlap * sin;
              
              // Calculate velocities in collision coordinate system
              const vx1 = circle1.vx * cos + circle1.vy * sin;
              const vy1 = circle1.vy * cos - circle1.vx * sin;
              const vx2 = circle2.vx * cos + circle2.vy * sin;
              const vy2 = circle2.vy * cos - circle2.vx * sin;
              
              // Elastic collision formula (assuming equal mass)
              const newVx1 = vx2;
              const newVx2 = vx1;
              
              // Convert back to original coordinate system
              circle1.vx = newVx1 * cos - vy1 * sin;
              circle1.vy = vy1 * cos + newVx1 * sin;
              circle2.vx = newVx2 * cos - vy2 * sin;
              circle2.vy = vy2 * cos + newVx2 * sin;
            }
          }
        }
        
        return newCircles;
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