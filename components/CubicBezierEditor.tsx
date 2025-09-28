
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { AnimationProps } from '../types';
import { EASING_MAP } from '../constants';
import AnimationDisplay from './AnimationDisplay';

interface CubicBezierEditorProps {
  targetProps: AnimationProps;
  onFinish: () => void;
}

const EDITOR_WIDTH = 400;
const EDITOR_HEIGHT = 300;
const HANDLE_RADIUS = 8;

const parseCubicBezier = (easing: string): [number, number, number, number] | null => {
  const match = easing.match(/cubic-bezier\(([^)]+)\)/);
  if (match) {
    const values = match[1].split(',').map(parseFloat);
    if (values.length === 4) {
      return values as [number, number, number, number];
    }
  }
  return null;
};

const CubicBezierEditor: React.FC<CubicBezierEditorProps> = ({ targetProps, onFinish }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [p1, setP1] = useState({ x: 0.25, y: 0.1 });
  const [p2, setP2] = useState({ x: 0.25, y: 1.0 });
  const [draggingHandle, setDraggingHandle] = useState<'p1' | 'p2' | null>(null);
  const [animationKey, setAnimationKey] = useState(0);

  const targetCoords = useMemo(() => {
    const value = EASING_MAP[targetProps.easing];
    return parseCubicBezier(value);
  }, [targetProps.easing]);

  // Dynamic Y-axis calculation to ensure handles are always visible and editable.
  const { yRange, yMin } = useMemo(() => {
    // Consider start/end points, user handle points, and target handle points for scaling
    const yPoints = [0, 1, p1.y, p2.y];
    if (targetCoords) {
      yPoints.push(targetCoords[1], targetCoords[3]);
    }

    const minY = Math.min(...yPoints);
    const maxY = Math.max(...yPoints);

    // Calculate a desired range that includes 20% padding on top and bottom.
    // Ensure the range is at least 2.0 units high to give plenty of space.
    const desiredRange = Math.max(2.0, (maxY - minY) * 1.4);
    const currentCenter = (minY + maxY) / 2;

    const finalYMin = currentCenter - desiredRange / 2;

    return { yRange: desiredRange, yMin: finalYMin };
  }, [targetCoords, p1.y, p2.y]);


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
  
  const handleReplayAnimations = () => {
    setAnimationKey(prev => prev + 1);
  };

  const p0_svg = toSvgPoint({ x: 0, y: 0 });
  const p3_svg = toSvgPoint({ x: 1, y: 1 });
  
  const p1_svg = toSvgPoint(p1);
  const p2_svg = toSvgPoint(p2);
  
  const userCurvePath = `M ${p0_svg.x},${p0_svg.y} C ${p1_svg.x},${p1_svg.y} ${p2_svg.x},${p2_svg.y} ${p3_svg.x},${p3_svg.y}`;
  
  const targetCurvePath = useMemo(() => {
    if (!targetCoords) return '';
    const [tx1, ty1, tx2, ty2] = targetCoords;
    const tp1_svg = toSvgPoint({ x: tx1, y: ty1 });
    const tp2_svg = toSvgPoint({ x: tx2, y: ty2 });
    return `M ${p0_svg.x},${p0_svg.y} C ${tp1_svg.x},${tp1_svg.y} ${tp2_svg.x},${tp2_svg.y} ${p3_svg.x},${p3_svg.y}`;
  }, [targetCoords, toSvgPoint, p0_svg, p3_svg]);

  const userCubicBezier = `cubic-bezier(${p1.x.toFixed(2)}, ${p1.y.toFixed(2)}, ${p2.x.toFixed(2)}, ${p2.y.toFixed(2)})`;
  
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

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fade-in">
        <div className="text-left p-6">
            <h2 className="text-3xl font-bold text-black">Recreate the Curve: {targetProps.easing}</h2>
            <p className="mt-2 text-stone-500">Drag the handles to make your animation match the target's motion.</p>
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
                    <h3 className="text-lg font-bold mb-2 text-center text-black">Target Animation</h3>
                    <AnimationDisplay key={`target-${animationKey}`} animationProps={targetProps} />
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-2 text-center text-black">Your Curve's Animation</h3>
                    <AnimationDisplay key={`user-${animationKey}`} animationProps={targetProps} overrideTimingFunction={userCubicBezier} />
                </div>
                 <div className="flex justify-center">
                    <button onClick={handleReplayAnimations} className="px-6 py-2 bg-black text-white font-bold rounded-xl shadow-sm hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-[#e0dce0]">
                        Replay Both
                    </button>
                </div>
            </div>
        </div>
        
        <div className="text-center pt-4">
            <button onClick={onFinish} className="px-8 py-3 bg-black text-white font-bold rounded-2xl shadow-sm hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-[#F7F7F7]">
                Done, Next Level!
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

export default CubicBezierEditor;