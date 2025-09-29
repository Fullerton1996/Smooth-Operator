
import React, { useState, useCallback, useEffect } from 'react';
import { AnimationProps, EasingFunction, Level } from '../types';
import { LEVELS, EASING_MAP } from '../constants';
import AnimationDisplay from './AnimationDisplay';
import EasingSelector from './EasingSelector';
import FeedbackModal from './FeedbackModal';
import CubicBezierEditor from './CubicBezierEditor';
import { getHint, getFeedback } from '../services/geminiService';

const LevelManager: React.FC = () => {
  const [shuffledLevels, setShuffledLevels] = useState<Level[]>([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [selectedEasing, setSelectedEasing] = useState<EasingFunction>('linear');
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hint, setHint] = useState('');
  const [animationKey, setAnimationKey] = useState(0);
  const [isRecreatingCurve, setIsRecreatingCurve] = useState(false);
  const [curveToRecreate, setCurveToRecreate] = useState<AnimationProps | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);

  const shuffleLevels = useCallback(() => {
    const shuffled = [...LEVELS].sort(() => Math.random() - 0.5);
    setShuffledLevels(shuffled);
    setCurrentLevelIndex(0);
  }, []);

  useEffect(() => {
    // Populate the levels array on mount, but don't reset the starting index.
    const shuffled = [...LEVELS].sort(() => Math.random() - 0.5);
    setShuffledLevels(shuffled);
  }, []);
  
  const calculateScore = useCallback((userEasing: EasingFunction, target: AnimationProps) => {
    return userEasing === target.easing ? 100 : 0;
  }, []);
  
  if (shuffledLevels.length === 0) {
    return <div className="text-center p-10">Loading challenges...</div>;
  }

  const currentLevel = shuffledLevels[currentLevelIndex];

  const handleCheckWork = async () => {
    setIsLoading(true);
    const calculatedScore = calculateScore(selectedEasing, currentLevel.targetProps);
    setScore(calculatedScore);
    if (calculatedScore === 100) {
      setCurveToRecreate(currentLevel.targetProps);
    }
    const userSelection: AnimationProps = { easing: selectedEasing, duration: 0 };
    const aiFeedback = await getFeedback(currentLevel, userSelection);
    setFeedback(aiFeedback);
    setShowModal(true);
    setIsLoading(false);
  };

  const handleGetHint = async () => {
    setIsLoading(true);
    setHint('Thinking of a hint...');
    const userSelection: AnimationProps = { easing: selectedEasing, duration: 0 };
    const aiHint = await getHint(currentLevel, userSelection);
    setHint(aiHint);
    setIsLoading(false);
    setTimeout(() => setHint(''), 5000);
  };
  
  const handleNextLevel = () => {
    setShowModal(false);
    setIsRecreatingCurve(false);
    setCurveToRecreate(null);

    const nextLevelIndex = currentLevelIndex + 1;
    if (nextLevelIndex >= shuffledLevels.length) {
      setGameCompleted(true);
    } else {
      setCurrentLevelIndex(nextLevelIndex);
    }

    setSelectedEasing('linear');
    setFeedback('');
    setScore(0);
    setAnimationKey(prev => prev + 1);
  };

  const handlePlayAgain = () => {
    setGameCompleted(false);
    shuffleLevels();
    setSelectedEasing('linear');
    setFeedback('');
    setScore(0);
    setAnimationKey(prev => prev + 1);
  };

  const handleStartRecreateCurve = () => {
    setShowModal(false);
    setIsRecreatingCurve(true);
  };

  const handleReplayAnimation = () => {
    setAnimationKey(prev => prev + 1);
  };

  const handleEasingChange = (easing: EasingFunction) => {
    setSelectedEasing(easing);
  };
  
  if (gameCompleted) {
    return (
      <div className="text-center p-10 max-w-2xl mx-auto bg-white/50 rounded-3xl shadow-lg animate-fade-in">
        <h2 className="text-5xl font-bold text-black mb-4">Congratulations!</h2>
        <p className="text-2xl text-stone-600 mb-8">You're now a smooth operator.</p>
        <button
          onClick={handlePlayAgain}
          className="px-8 py-4 bg-black text-white font-bold rounded-2xl shadow-sm hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white"
        >
          Play Again
        </button>
         <style>{`
            @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .animate-fade-in {
                animation: fade-in 0.5s ease-out forwards;
            }
        `}</style>
      </div>
    );
  }

  if (isRecreatingCurve && curveToRecreate) {
    return (
      <CubicBezierEditor 
        targetProps={curveToRecreate} 
        onFinish={handleNextLevel} 
      />
    );
  }


  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center p-6">
        <h2 className="text-3xl font-bold text-black">Level {currentLevelIndex + 1} of {shuffledLevels.length}</h2>
        <p className="mt-2 text-stone-500">{currentLevel.description}</p>
      </div>

      <div className="p-6 bg-[#d9e2d7] rounded-3xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-2 text-black">Target Animation</h3>
            <AnimationDisplay key={`target-${animationKey}`} animationProps={currentLevel.targetProps} />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold mb-2 text-black">Your Selection</h3>
            <AnimationDisplay 
              key={`user-${animationKey}`} 
              animationProps={{ ...currentLevel.targetProps, easing: selectedEasing }} 
            />
          </div>
        </div>
      </div>
      
      <div className="p-6 bg-[#e0dce0] rounded-3xl space-y-6">
        <EasingSelector selectedEasing={selectedEasing} onEasingChange={handleEasingChange} />
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-black/10">
            <button
            onClick={handleReplayAnimation}
            className="w-full sm:w-auto px-8 py-3 bg-black text-white font-bold rounded-2xl shadow-sm hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-[#e0dce0]"
            >
            Replay
            </button>
            <button
            onClick={handleGetHint}
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3 bg-stone-200 text-black font-bold rounded-2xl hover:bg-stone-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-[#e0dce0]"
            >
            {isLoading && hint ? 'Thinking...' : 'Get a Hint'}
            </button>
            <button
            onClick={handleCheckWork}
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3 bg-black text-white font-bold rounded-2xl shadow-sm hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-[#e0dce0]"
            >
            {isLoading && !hint ? 'Analyzing...' : 'Check Answer'}
            </button>
        </div>
      </div>


      {hint && (
        <div className="mt-4 p-4 text-center bg-stone-200 border border-stone-300 rounded-2xl">
          <p className="text-stone-800">{hint}</p>
        </div>
      )}

      <FeedbackModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        feedback={feedback}
        score={score}
        onNextLevel={handleNextLevel}
        onRecreateCurve={handleStartRecreateCurve}
      />
    </div>
  );
};

export default LevelManager;