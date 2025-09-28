import React from 'react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: string;
  score: number;
  onNextLevel: () => void;
  onRecreateCurve: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, feedback, score, onNextLevel, onRecreateCurve }) => {
  if (!isOpen) return null;

  const isCorrect = score === 100;
  const scoreColor = isCorrect ? 'text-[#4A5C46]' : 'text-red-500';
  const scoreText = isCorrect ? 'Correct!' : 'Not Quite!';

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-[#F7F7F7] border border-stone-200 rounded-3xl shadow-2xl max-w-lg w-full p-8 text-center animate-fade-in-up">
        <h2 className={`text-4xl font-bold ${scoreColor}`}>{scoreText}</h2>
        <p className="text-stone-600 my-6 text-lg">{feedback}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {isCorrect ? (
            <>
              <button
                onClick={onRecreateCurve}
                className="px-8 py-3 bg-stone-200 text-black font-bold rounded-2xl hover:bg-stone-300 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-[#F7F7F7]"
              >
                Recreate the Curve
              </button>
              <button
                onClick={onNextLevel}
                className="px-8 py-3 bg-[#d9e2d7] text-black font-bold rounded-2xl shadow-sm hover:bg-[#c8d1c6] transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-[#F7F7F7]"
              >
                Next Level
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-8 py-3 bg-black hover:opacity-80 text-white font-bold rounded-2xl transition-opacity focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-[#F7F7F7]"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FeedbackModal;
