import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import AnimationDisplay from './AnimationDisplay';
import { AnimationProps } from '../types';

interface CurveGuess {
  target: number[];
  targetName: string;
  userGuess?: number[];
  score?: number;
}

const EDITOR_WIDTH = 400;
const EDITOR_HEIGHT = 300;
const HANDLE_RADIUS = 8;

const FreestyleMode: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentChallenge, setCurrentChallenge] = useState<CurveGuess | null>(null);
  const [p1, setP1] = useState({ x: 0.25, y: 0.1 });
  const [p2, setP2] = useState({ x: 0.25, y: 1.0 });
  const [draggingHandle, setDraggingHandle] = useState<'p1' | 'p2' | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  // Predefined challenging curves
  const challenges = [
    { name: "Bounce", curve: [0.68, -0.55, 0.265, 1.55] },
    { name: "Elastic", curve: [0.175, 0.885, 0.32, 1.275] },
    { name: "Back", curve: [0.68, -0.55, 0.265, 1.55] },
    { name: "Ease-In-Out", curve: [0.42, 0, 0.58, 1] },
    { name: "Power", curve: [0.25, 0.46, 0.45, 0.94] },
    { name: "Sine", curve: [0.39, 0.575, 0.565, 1] },
  ];

  const generateChallenge = () => {
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    setCurrentChallenge({ target: randomChallenge.curve, targetName: randomChallenge.name });
    setP1({ x: 0.25, y: 0.1 });
    setP2({ x: 0.25, y: 1.0 });
    setScore(null);
    setShowResult(false);
  };

  // Dynamic Y-axis calculation to ensure handles are always visible and editable.
  const { yRange, yMin } = useMemo(() => {
    // Consider start/end points, user handle points, and target handle points for scaling
    const yPoints = [0, 1, p1.y, p2.y];
    if (currentChallenge) {
      yPoints.push(currentChallenge.target[1], currentChallenge.target[3]);
    }

    const minY = Math.min(...yPoints);
    const maxY = Math.max(...yPoints);

    // Calculate a desired range that includes 20% padding on top and bottom.
    // Ensure the range is at least 2.0 units high to give plenty of space.
    const desiredRange = Math.max(2.0, (maxY - minY) * 1.4);
    const currentCenter = (minY + maxY) / 2;

    const finalYMin = currentCenter - desiredRange / 2;

    return { yRange: desiredRange, yMin: finalYMin };
  }, [currentChallenge, p1.y, p2.y]);

  const toSvgPoint = useCallback((coord: { x: number; y: number }) => {
    return {
      x: coord.x * EDITOR_WIDTH,
      y: EDITOR_HEIGHT - ((coord.y - yMin) / yRange) * EDITOR_HEIGHT,
    };
  }, [yMin, yRange]);
  
  const fromSvgPoint = useCallback((point: { x: number; y: number }) => {
    return {
      x: Math.max(0, Math.min(1, point.x / EDITOR_WIDTH)),
      y: ((EDITOR_HEIGHT - point.y) / EDITOR_HEIGHT) * yRange + yMin,
    };
  }, [yMin, yRange]);

  const handleMouseDown = (e: React.MouseEvent, handle: 'p1' | 'p2') => {
    e.preventDefault();
    setDraggingHandle(handle);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggingHandle || !svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const svgPoint = {
      x: e.clientX - svgRect.left,
      y: e.clientY - svgRect.top,
    };
    const newCoord = fromSvgPoint(svgPoint);
    if (draggingHandle === 'p1') {
      setP1(newCoord);
    } else {
      setP2(newCoord);
    }
  }, [draggingHandle, fromSvgPoint]);
  
  const handleMouseUp = useCallback(() => {
    setDraggingHandle(null);
  }, []);

  useEffect(() => {
    if (draggingHandle) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingHandle, handleMouseMove, handleMouseUp]);

  const calculateScore = () => {
    if (!currentChallenge) return;

    const userCurve = [p1.x, p1.y, p2.x, p2.y];
    // Calculate how close the user's curve is to the target
    const differences = currentChallenge.target.map((target, index) => 
      Math.abs(target - userCurve[index])
    );
    const totalDifference = differences.reduce((sum, diff) => sum + diff, 0);
    const maxPossibleDifference = 4; // Maximum possible difference
    const accuracy = Math.max(0, (maxPossibleDifference - totalDifference) / maxPossibleDifference);
    const finalScore = Math.round(accuracy * 100);
    
    setScore(finalScore);
    setShowResult(true);
  };

  const handleReplayAnimations = () => {
    setAnimationKey(prev => prev + 1);
  };

  const getCurveString = (curve: number[]) => 
    `cubic-bezier(${curve.map(n => n.toFixed(3)).join(', ')})`;

  useEffect(() => {
    generateChallenge();
  }, []);

  if (!currentChallenge) return null;

  const p0_svg = toSvgPoint({ x: 0, y: 0 });
  const p3_svg = toSvgPoint({ x: 1, y: 1 });
  
  const p1_svg = toSvgPoint(p1);
  const p2_svg = toSvgPoint(p2);
  
  const userCurvePath = `M ${p0_svg.x},${p0_svg.y} C ${p1_svg.x},${p1_svg.y} ${p2_svg.x},${p2_svg.y} ${p3_svg.x},${p3_svg.y}`;
  
  const targetCurvePath = useMemo(() => {
    if (!currentChallenge) return '';
    const [tx1, ty1, tx2, ty2] = currentChallenge.target;
    const tp1_svg = toSvgPoint({ x: tx1, y: ty1 });
    const tp2_svg = toSvgPoint({ x: tx2, y: ty2 });
    return `M ${p0_svg.x},${p0_svg.y} C ${tp1_svg.x},${tp1_svg.y} ${tp2_svg.x},${tp2_svg.y} ${p3_svg.x},${p3_svg.y}`;
  }, [currentChallenge, toSvgPoint, p0_svg, p3_svg]);

  const userCubicBezier = `cubic-bezier(${p1.x.toFixed(2)}, ${p1.y.toFixed(2)}, ${p2.x.toFixed(2)}, ${p2.y.toFixed(2)})`;
  const targetCubicBezier = getCurveString(currentChallenge.target);

  const renderGridLines = () => {
    const lines = [];
    const gridSpacingX = EDITOR_WIDTH / 10;
    const gridSpacingY = EDITOR_HEIGHT / 10;
    // Vertical lines
    for (let i = 1; i < 10; i++) {
        lines.push(<line key={`v-${i}`} x1={i * gridSpacingX} y1="0" x2={i * gridSpacingX} y2={EDITOR_HEIGHT} stroke="#000" strokeOpacity="0.05" />);
    }
    // Horizontal lines
    for (let i = 1; i < 10; i++) {
        lines.push(<line key={`h-${i}`} x1="0" y1={i * gridSpacingY} x2={EDITOR_WIDTH} y2={i * gridSpacingY} stroke="#000" strokeOpacity="0.05" />);
    }
    // Main axes (0 and 1 value)
    const y0_svg = toSvgPoint({x: 0, y: 0});
    const y1_svg = toSvgPoint({x: 0, y: 1});

    // only render axes if they are in view
    if (y0_svg.y <= EDITOR_HEIGHT && y0_svg.y >= 0) {
        lines.push(<path key="y-axis-0" d={`M 0 ${y0_svg.y} H ${EDITOR_WIDTH}`} stroke="#000" strokeOpacity="0.1" />);
    }
    if (y1_svg.y <= EDITOR_HEIGHT && y1_svg.y >= 0) {
        lines.push(<path key="y-axis-1" d={`M 0 ${y1_svg.y} H ${EDITOR_WIDTH}`} stroke="#000" strokeOpacity="0.1" />);
    }
    return lines;
  };

  // Create animation props for the target animation
  const targetAnimationProps: AnimationProps = {
    easing: 'ease' as any, // We'll override this with the actual curve
    duration: 2
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fade-in">
      <div className="text-center p-6">
        <h2 className="text-3xl font-bold text-black mb-2">Freestyle Mode: Mystery Curve</h2>
        <p className="text-stone-600">Watch the target animation and recreate the curve by dragging the handles!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="p-6 bg-[#d9e2d7] rounded-3xl flex flex-col items-center space-y-4">
          <svg ref={svgRef} width="100%" viewBox={`0 0 ${EDITOR_WIDTH} ${EDITOR_HEIGHT}`} className="bg-black/5 rounded-2xl cursor-grab active:cursor-grabbing">
            {renderGridLines()}
            <path d={targetCurvePath} stroke="rgba(0,0,0,0.2)" strokeWidth="3" fill="none" strokeDasharray="4 4" />
            <line x1={p0_svg.x} y1={p0_svg.y} x2={p1_svg.x} y2={p1_svg.y} stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
            <line x1={p3_svg.x} y1={p3_svg.y} x2={p2_svg.x} y2={p2_svg.y} stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
            <path d={userCurvePath} stroke="black" strokeWidth="4" fill="none" />
            <circle cx={p1_svg.x} cy={p1_svg.y} r={HANDLE_RADIUS} fill="white" stroke="black" strokeWidth="2" onMouseDown={(e) => handleMouseDown(e, 'p1')} className="cursor-pointer" />
            <circle cx={p2_svg.x} cy={p2_svg.y} r={HANDLE_RADIUS} fill="white" stroke="black" strokeWidth="2" onMouseDown={(e) => handleMouseDown(e, 'p2')} className="cursor-pointer" />
          </svg>
          <div className="text-center font-mono bg-white/50 p-3 rounded-lg text-sm text-black w-full">
            {userCubicBezier}
          </div>
        </div>
        
        <div className="p-6 bg-[#e0dce0] rounded-3xl space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-2 text-center text-black">Target Animation ({currentChallenge.targetName})</h3>
            <AnimationDisplay key={`target-${animationKey}`} animationProps={targetAnimationProps} overrideTimingFunction={targetCubicBezier} />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2 text-center text-black">Your Curve's Animation</h3>
            <AnimationDisplay key={`user-${animationKey}`} animationProps={targetAnimationProps} overrideTimingFunction={userCubicBezier} />
          </div>
          <div className="flex justify-center">
            <button onClick={handleReplayAnimations} className="px-6 py-2 bg-black text-white font-bold rounded-xl shadow-sm hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-[#e0dce0]">
              Replay Both
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="text-center space-y-6">
        <button
          onClick={calculateScore}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
        >
          Check My Guess!
        </button>

        {showResult && (
          <div className="bg-stone-100 rounded-2xl p-6 max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">
              Score: {score}%
            </h3>
            <div className="space-y-3 text-left">
              <p className="text-stone-700 font-mono text-sm">
                <strong>Target:</strong> {targetCubicBezier}
              </p>
              <p className="text-stone-700 font-mono text-sm">
                <strong>Your guess:</strong> {userCubicBezier}
              </p>
              {score !== null && (
                <p className="text-xl font-bold text-center mt-4">
                  {score >= 90 ? "🎉 Incredible!" : 
                   score >= 80 ? "🔥 Excellent!" :
                   score >= 70 ? "👏 Great job!" :
                   score >= 60 ? "👍 Good effort!" : "🤔 Keep practicing!"}
                </p>
              )}
            </div>
          </div>
        )}

        <button
          onClick={generateChallenge}
          className="bg-stone-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-stone-700 transition-colors shadow-lg"
        >
          New Challenge
        </button>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FreestyleMode;