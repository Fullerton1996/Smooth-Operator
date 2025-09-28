
import React, { useId } from 'react';
import { AnimationProps } from '../types';
import { EASING_MAP } from '../constants';

interface AnimationDisplayProps {
  animationProps: AnimationProps;
  overrideTimingFunction?: string;
}

const AnimationDisplay: React.FC<AnimationDisplayProps> = ({ animationProps, overrideTimingFunction }) => {
  const { duration, easing } = animationProps;
  const id = useId();
  const animationName = `anim-${id.replace(/:/g, '')}`;

  const keyframes = `
    @keyframes ${animationName} {
      from {
        transform: translateX(-100px);
      }
      to {
        transform: translateX(100px);
      }
    }
  `;

  const animationStyle: React.CSSProperties = {
    animationName,
    animationDuration: `${duration}s`,
    animationTimingFunction: overrideTimingFunction || EASING_MAP[easing],
    animationIterationCount: 'infinite',
    animationDirection: 'alternate',
  };

  return (
    <div 
      className="w-full h-40 flex items-center justify-center bg-black/5 rounded-2xl overflow-hidden relative"
      aria-label={`Animation with ${easing} easing over ${duration} seconds`}
    >
      <style>{keyframes}</style>
      <div className="w-[200px] h-0.5 bg-black/20 rounded-full absolute"></div>
      
      <div
        style={animationStyle}
        className="w-10 h-16 bg-black rounded-2xl"
      />
    </div>
  );
};

export default AnimationDisplay;