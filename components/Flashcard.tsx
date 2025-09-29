import React, { useState } from 'react';

interface FlashcardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}

const Flashcard: React.FC<FlashcardProps> = ({ front, back, className }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`relative w-full h-full cursor-pointer [perspective:1000px] ${className}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className="absolute w-full h-full [transform-style:preserve-3d] transition-transform duration-500"
        style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Front */}
        <div className="absolute w-full h-full [backface-visibility:hidden] bg-white dark:bg-slate-700 rounded-lg shadow-lg flex items-center justify-center p-4">
          {front}
        </div>
        {/* Back */}
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white dark:bg-slate-700 rounded-lg shadow-lg flex items-center justify-center p-4">
          {back}
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
