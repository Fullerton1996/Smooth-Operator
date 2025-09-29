import React, { useState, useEffect, useRef } from 'react';

interface PhysicsObject {
  id: number;
  x: number;
  y: number;
  vx: number; // velocity x
  vy: number; // velocity y
  radius: number;
  mass: number;
  image: string;
  isDragging: boolean;
  dragOffset: { x: number; y: number };
}

const Header: React.FC = () => {
  const [titleVisible, setTitleVisible] = useState('');
  const [subtitleVisible, setSubtitleVisible] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [objects, setObjects] = useState<PhysicsObject[]>([]);
  const animationRef = useRef<number>();
  const containerRef = useRef<HTMLElement>(null);

  const title = "Smooth Operator";
  const subtitle = "Easing you into easing.";
  const images = ['/mrclean.png', '/sade.png', '/hardhat.png', '/clarkson.png', '/lionel.png', '/mcqueen.png'];

  // Physics constants - DVD screensaver style
  const GRAVITY = 0; // Zero gravity - pure floating motion
  const DAMPING = 1.0; // No damping - perfect energy conservation
  const BOUNCE_DAMPING = 1.0; // Perfect elastic collisions

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

    // Initialize random objects - DVD screensaver style motion
    // Restrict to header area only (viewport height)
    const headerHeight = window.innerHeight;
    const initialObjects: PhysicsObject[] = images.map((image, index) => ({
      id: index,
      x: Math.random() * (window.innerWidth - 400) + 200,
      y: Math.random() * (headerHeight - 400) + 200,
      vx: Math.random() > 0.5 ? 4 : -4, // Consistent speeds, random directions
      vy: Math.random() > 0.5 ? 3 : -3, // Different speeds for varied patterns
      radius: 150, // Massive size!
      mass: 1,
      image,
      isDragging: false,
      dragOffset: { x: 0, y: 0 }
    }));

    setObjects(initialObjects);

    return () => {
      clearInterval(titleTimer);
      clearInterval(cursorTimer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Physics simulation
  useEffect(() => {
    const animate = () => {
      setObjects(prevObjects => {
        const newObjects = prevObjects.map(obj => {
          if (obj.isDragging) return obj;

          let newObj = { ...obj };
          
          // No gravity - pure DVD screensaver physics
          // No damping - maintain perfect velocity
          
          // Update position
          newObj.x += newObj.vx;
          newObj.y += newObj.vy;
          
          // Boundary collision - restrict to header area only
          const headerHeight = window.innerHeight; // Only bounce within the header viewport
          
          if (newObj.x - newObj.radius < 0) {
            newObj.x = newObj.radius;
            newObj.vx *= -BOUNCE_DAMPING;
          } else if (newObj.x + newObj.radius > window.innerWidth) {
            newObj.x = window.innerWidth - newObj.radius;
            newObj.vx *= -BOUNCE_DAMPING;
          }
          
          if (newObj.y - newObj.radius < 0) {
            newObj.y = newObj.radius;
            newObj.vy *= -BOUNCE_DAMPING;
          } else if (newObj.y + newObj.radius > headerHeight) {
            newObj.y = headerHeight - newObj.radius;
            newObj.vy *= -BOUNCE_DAMPING;
          }
          
          return newObj;
        });

        // Object-to-object collision
        for (let i = 0; i < newObjects.length; i++) {
          for (let j = i + 1; j < newObjects.length; j++) {
            const obj1 = newObjects[i];
            const obj2 = newObjects[j];
            
            if (obj1.isDragging || obj2.isDragging) continue;
            
            const dx = obj2.x - obj1.x;
            const dy = obj2.y - obj1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < obj1.radius + obj2.radius) {
              // Collision detected - simple elastic collision
              const angle = Math.atan2(dy, dx);
              const sin = Math.sin(angle);
              const cos = Math.cos(angle);
              
              // Separate objects
              const overlap = (obj1.radius + obj2.radius - distance) / 2;
              obj1.x -= overlap * cos;
              obj1.y -= overlap * sin;
              obj2.x += overlap * cos;
              obj2.y += overlap * sin;
              
              // Exchange velocities (simplified)
              const tempVx = obj1.vx;
              const tempVy = obj1.vy;
              obj1.vx = obj2.vx * BOUNCE_DAMPING;
              obj1.vy = obj2.vy * BOUNCE_DAMPING;
              obj2.vx = tempVx * BOUNCE_DAMPING;
              obj2.vy = tempVy * BOUNCE_DAMPING;
            }
          }
        }

        return newObjects;
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

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent, objectId: number) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setObjects(prev => prev.map(obj => {
      if (obj.id === objectId) {
        return {
          ...obj,
          isDragging: true,
          dragOffset: {
            x: mouseX - obj.x,
            y: mouseY - obj.y
          }
        };
      }
      return obj;
    }));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setObjects(prev => prev.map(obj => {
      if (obj.isDragging) {
        const newX = mouseX - obj.dragOffset.x;
        const newY = mouseY - obj.dragOffset.y;
        const headerHeight = window.innerHeight; // Constrain to header area
        return {
          ...obj,
          x: Math.max(obj.radius, Math.min(window.innerWidth - obj.radius, newX)),
          y: Math.max(obj.radius, Math.min(headerHeight - obj.radius, newY)),
          vx: 0,
          vy: 0
        };
      }
      return obj;
    }));
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setObjects(prev => prev.map(obj => {
      if (obj.isDragging) {
        // Add throw velocity based on mouse movement
        const throwForce = 0.2;
        return {
          ...obj,
          isDragging: false,
          vx: e.movementX * throwForce,
          vy: e.movementY * throwForce
        };
      }
      return obj;
    }));
  };

  return (
    <header 
      ref={containerRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Physics Objects */}
      {objects.map(obj => (
        <div
          key={obj.id}
          className="absolute select-none cursor-grab active:cursor-grabbing"
          style={{
            left: obj.x - obj.radius,
            top: obj.y - obj.radius,
            width: obj.radius * 2,
            height: obj.radius * 2,
            opacity: 1,
            transform: obj.isDragging ? 'scale(1.1)' : 'scale(1)',
            transition: obj.isDragging ? 'none' : 'transform 0.1s ease-out',
            zIndex: obj.isDragging ? 20 : 1,
          }}
          onMouseDown={(e) => handleMouseDown(e, obj.id)}
        >
          <img 
            src={obj.image}
            alt="Interactive object"
            className="w-full h-full object-contain pointer-events-none"
            draggable={false}
          />
        </div>
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