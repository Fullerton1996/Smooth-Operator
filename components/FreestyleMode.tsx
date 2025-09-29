import React, { useState, useEffect } from 'react';

interface CurveGuess {
  target: number[];
  userGuess?: number[];
  score?: number;
}

const FreestyleMode: React.FC = () => {
  const [currentChallenge, setCurrentChallenge] = useState<CurveGuess | null>(null);
  const [userCurve, setUserCurve] = useState<number[]>([0.25, 0.1, 0.25, 1]);
  const [score, setScore] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

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
    setCurrentChallenge({ target: randomChallenge.curve });
    setUserCurve([0.25, 0.1, 0.25, 1]);
    setScore(null);
    setShowResult(false);
  };

  const calculateScore = () => {
    if (!currentChallenge) return;

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

  const getCurveString = (curve: number[]) => 
    `cubic-bezier(${curve.map(n => n.toFixed(3)).join(', ')})`;

  useEffect(() => {
    generateChallenge();
  }, []);

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-stone-200">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-stone-800 mb-2">Freestyle Mode</h2>
        <p className="text-stone-600">Match the mystery curve! Watch the animation and recreate it.</p>
      </div>

      {currentChallenge && (
        <div className="space-y-8">
          {/* Target Animation Preview */}
          <div className="bg-stone-100 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Mystery Curve Animation</h3>
            <div className="relative h-32 bg-white rounded-lg overflow-hidden">
              <div 
                className="absolute top-1/2 w-6 h-6 bg-blue-500 rounded-full transform -translate-y-1/2 animate-bounce"
                style={{
                  animation: `slideRight 2s infinite`,
                  animationTimingFunction: getCurveString(currentChallenge.target),
                }}
              />
            </div>
          </div>

          {/* User Curve Editor */}
          <div className="bg-stone-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Your Guess</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {userCurve.map((value, index) => (
                <div key={index} className="space-y-2">
                  <label className="block text-sm font-medium text-stone-700">
                    {index < 2 ? `Control Point ${index + 1}` : `Control Point ${index - 1}`} 
                    {index % 2 === 0 ? ' X' : ' Y'}
                  </label>
                  <input
                    type="range"
                    min="-2"
                    max="2"
                    step="0.01"
                    value={value}
                    onChange={(e) => {
                      const newCurve = [...userCurve];
                      newCurve[index] = parseFloat(e.target.value);
                      setUserCurve(newCurve);
                    }}
                    className="w-full"
                  />
                  <span className="text-xs text-stone-500">{value.toFixed(3)}</span>
                </div>
              ))}
            </div>

            {/* User Animation Preview */}
            <div className="relative h-32 bg-white rounded-lg overflow-hidden mb-4">
              <div 
                className="absolute top-1/2 w-6 h-6 bg-green-500 rounded-full transform -translate-y-1/2"
                style={{
                  animation: `slideRight 2s infinite`,
                  animationTimingFunction: getCurveString(userCurve),
                }}
              />
            </div>

            <p className="text-center text-sm text-stone-600 mb-4">
              {getCurveString(userCurve)}
            </p>
          </div>

          {/* Controls */}
          <div className="text-center space-y-4">
            <button
              onClick={calculateScore}
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              Check My Guess!
            </button>

            {showResult && (
              <div className="bg-stone-100 rounded-xl p-6">
                <h3 className="text-2xl font-bold mb-2">
                  Score: {score}%
                </h3>
                <div className="space-y-2">
                  <p className="text-stone-600">
                    Target: {getCurveString(currentChallenge.target)}
                  </p>
                  <p className="text-stone-600">
                    Your guess: {getCurveString(userCurve)}
                  </p>
                  {score !== null && (
                    <p className="text-lg font-medium">
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
              className="bg-stone-600 text-white px-6 py-2 rounded-full hover:bg-stone-700 transition-colors"
            >
              New Challenge
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideRight {
          0% { left: 0; }
          100% { left: calc(100% - 24px); }
        }
      `}</style>
    </div>
  );
};

export default FreestyleMode;