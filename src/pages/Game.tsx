import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import { 
  DndContext, 
  DragEndEvent, 
  MouseSensor, 
  TouchSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Star } from 'lucide-react';
import { useGame, DropResult } from '@/store/game-store';
import { Category } from '@/data/air-quality-data';
import { DroppableZone } from '@/components/DroppableZone';
import { DraggableItem } from '@/components/DraggableItem';
import { FeedbackOverlay } from '@/components/FeedbackOverlay';
import { AQIMeter } from '@/components/AQIMeter';

export default function Game() {
  const [, setLocation] = useLocation();
  const { 
    status, 
    score, 
    aqi,
    timeLeft, 
    items, 
    currentItemIndex, 
    handleDrop 
  } = useGame();

  const [feedback, setFeedback] = useState<DropResult | null>(null);
  
  // Bug fix pattern: Ref-based processing guard to prevent double-scoring
  // State updates are asynchronous and can lead to stale closures if clicked rapidly
  const isProcessingRef = useRef(false);

  useEffect(() => {
    if (status === 'idle') setLocation('/');
    if (status === 'finished') setLocation('/results');
  }, [status, setLocation]);

  // Stable callback for FeedbackOverlay to prevent timer resetting loop
  const handleFeedbackComplete = useCallback(() => {
    setFeedback(null);
    isProcessingRef.current = false;
  }, []);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 10 } })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Guard: Prevent handling if we are currently showing feedback
    if (isProcessingRef.current) return;
    
    if (over && over.id) {
      const droppedZone = over.id as Category;
      const item = active.data.current;
      
      if (item) {
        isProcessingRef.current = true;
        const result = handleDrop(item as any, droppedZone);
        setFeedback(result);
      }
    }
  };

  if (status !== 'playing') return null;

  const currentItem = items[currentItemIndex];
  const isTimeLow = timeLeft <= 10;
  const isTimeWarning = timeLeft <= 20 && timeLeft > 10;

  return (
    <div className="min-h-screen w-full flex flex-col relative bg-gradient-to-b from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 overflow-hidden">
      
      {/* Background styling based on AQI */}
      <div 
        className="absolute inset-0 z-0 transition-opacity duration-1000 pointer-events-none"
        style={{ 
          background: aqi > 100 
            ? 'linear-gradient(to bottom, rgba(120,100,90,0.2), rgba(0,0,0,0))' 
            : 'linear-gradient(to bottom, rgba(100,200,255,0.1), rgba(0,0,0,0))'
        }}
      />

      {/* Header HUD */}
      <header className="w-full px-4 pt-4 pb-2 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 z-10 shrink-0">
        
        <div className="flex w-full sm:w-auto justify-between sm:justify-start items-center gap-4">
          {/* Score Display */}
          <div className="flex items-center gap-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-border shadow-sm">
            <div className="bg-yellow-400/20 p-2 rounded-xl text-yellow-600 dark:text-yellow-400">
              <Star className="w-6 h-6 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Score</span>
              <span className="font-display font-black text-2xl text-foreground leading-none">{score}</span>
            </div>
          </div>

          {/* Timer Display */}
          <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-300 shadow-sm
            ${isTimeLow 
              ? 'border-destructive bg-destructive/10 animate-pulse text-destructive' 
              : isTimeWarning 
                ? 'border-yellow-500 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500'
                : 'border-border bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-foreground'
            }
          `}>
            <Timer className="w-6 h-6" />
            <span className="font-display font-black text-3xl w-10 text-center leading-none tracking-tight">
              {timeLeft}
            </span>
          </div>
        </div>

        {/* AQI Meter (Center/Right) */}
        <div className="w-full sm:w-64 md:w-80 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-3 rounded-2xl border border-border shadow-sm">
          <AQIMeter aqi={aqi} />
        </div>

      </header>

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 pb-6 z-10">
        
        <DndContext sensors={sensors} onDragEnd={onDragEnd}>
          
          {/* Active Item Drop Zone (Center Screen) */}
          <div className="flex-1 flex items-center justify-center relative min-h-[250px] my-4">
            
            <FeedbackOverlay feedback={feedback} onComplete={handleFeedbackComplete} />
            
            <AnimatePresence mode="wait">
              {currentItem && !feedback && (
                <motion.div
                  key={currentItem.id}
                  initial={{ scale: 0, y: -50, rotate: -10, opacity: 0 }}
                  animate={{ scale: 1, y: 0, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="z-40"
                >
                  <DraggableItem item={currentItem} />
                </motion.div>
              )}
            </AnimatePresence>

            {!currentItem && !feedback && (
              <div className="text-2xl font-display font-bold text-muted-foreground/60 text-center animate-pulse">
                Preparing next item...
              </div>
            )}
          </div>

          {/* Bins Row (Bottom) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-8 w-full shrink-0">
            <DroppableZone category="pollutes" />
            <DroppableZone category="neutral" />
            <DroppableZone category="cleans" />
          </div>

        </DndContext>
      </main>
    </div>
  );
}
