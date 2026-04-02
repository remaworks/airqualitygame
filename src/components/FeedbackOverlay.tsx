import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DropResult } from '@/store/game-store';

interface FeedbackOverlayProps {
  feedback: DropResult | null;
  onComplete: () => void;
}

export function FeedbackOverlay({ feedback, onComplete }: FeedbackOverlayProps) {
  // Bug fix pattern: Keep onComplete in a ref so the timeout closure never goes stale,
  // preventing continuous scoring/looping bugs on re-renders.
  const onCompleteRef = useRef(onComplete);
  
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!feedback) return;
    
    // Auto-dismiss after 2 seconds to allow reading the fun fact
    const timer = setTimeout(() => {
      onCompleteRef.current();
    }, 2000);
    
    return () => clearTimeout(timer);
    // ONLY depend on feedback. Adding onComplete here causes infinite loops!
  }, [feedback]);

  return (
    <AnimatePresence>
      {feedback && (
        <motion.div
          key={`${feedback.item.id}-feedback`}
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.9 }}
          transition={{ type: 'spring', damping: 18, stiffness: 200 }}
          className="absolute z-50 inset-0 pointer-events-none flex flex-col items-center justify-center px-4"
        >
          <div className={`
            flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-xl max-w-md w-full text-center border-2
            ${feedback.isCorrect 
              ? 'bg-[hsl(150_70%_40%)]/95 border-white/40 text-white' 
              : 'bg-[hsl(0_70%_50%)]/95 border-white/20 text-white'
            }
          `}>
            <div className="text-7xl mb-3 drop-shadow-xl animate-bounce">
              {feedback.isCorrect ? '✨' : '⚠️'}
            </div>
            
            <div className="flex items-center gap-3 mb-2">
              <span className="font-display font-black text-4xl sm:text-5xl drop-shadow-md">
                {feedback.points > 0 ? `+${feedback.points}` : feedback.points}
              </span>
              <span className="text-xl font-bold uppercase tracking-widest opacity-90 pt-1">Points</span>
            </div>
            
            <p className="font-sans font-medium text-lg sm:text-xl text-white/95 leading-relaxed drop-shadow-sm mt-2">
              {feedback.isCorrect 
                ? feedback.item.funFact 
                : feedback.item.wrongReason || 'That goes somewhere else!'}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
