
import React from 'react';
import { EasingFunction } from '../types';
import { EASING_MAP } from '../constants';

interface EasingSelectorProps {
  selectedEasing: EasingFunction;
  onEasingChange: (easing: EasingFunction) => void;
}

const EasingSelector: React.FC<EasingSelectorProps> = ({ selectedEasing, onEasingChange }) => {
  const easingOptions = Object.keys(EASING_MAP) as EasingFunction[];

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-center text-black">Which easing function is it?</h3>
      <div className="flex flex-wrap justify-center gap-4">
        {easingOptions.map(easing => (
          <button
            key={easing}
            onClick={() => onEasingChange(easing)}
            className={`min-w-[120px] p-4 font-bold rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-[#e0dce0]
              ${selectedEasing === easing 
                ? 'bg-black text-white shadow-md' 
                : 'bg-black/5 text-black hover:bg-black/10'
              }`}
            aria-pressed={selectedEasing === easing}
          >
            {easing}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EasingSelector;