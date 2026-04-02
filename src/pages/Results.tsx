import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGame } from '@/store/game-store';
import { RotateCcw, Share2, CheckCircle2, XCircle, Code, Wind, CloudFog } from 'lucide-react';
import { AQIMeter } from '@/components/AQIMeter';

export default function Results() {
  const [, setLocation] = useLocation();
  const { playerName, score, aqi, history, status, resetGame } = useGame();
  const [showEmbed, setShowEmbed] = useState(false);

  useEffect(() => {
    if (status !== 'finished') {
      setLocation('/');
      return;
    }

    const correctCount = history.filter(h => h.isCorrect).length;
    
    // Celebrate if they did well (more than 50% correct AND decent AQI)
    if (correctCount > history.length * 0.5 && aqi < 100) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#38bdf8', '#4ade80', '#fde047'] // Sky blue, green, yellow
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#38bdf8', '#4ade80', '#fde047']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [status, setLocation, history, aqi]);

  const handlePlayAgain = () => {
    resetGame();
    setLocation('/');
  };

  const correctCount = history.filter(h => h.isCorrect).length;
  const totalItems = history.length;
  
  // Calculate Grade based on Score and final AQI
  let gradeTitle = "Smog City Resident 🌫️";
  let gradeColor = "text-slate-500";
  let GradeIcon = CloudFog;
  
  const accuracy = totalItems > 0 ? correctCount / totalItems : 0;

  if (accuracy > 0.8 && aqi <= 50) {
    gradeTitle = "Air Quality Hero 🏆";
    gradeColor = "text-yellow-500";
    GradeIcon = Wind;
  } else if (accuracy > 0.6 && aqi <= 100) {
    gradeTitle = "Clean Air Champion 🌬️";
    gradeColor = "text-primary";
    GradeIcon = Wind;
  } else if (accuracy > 0.4) {
    gradeTitle = "Air Aware Citizen 🌤️";
    gradeColor = "text-orange-400";
    GradeIcon = Wind;
  }

  const embedCode = `<iframe src="${window.location.origin}${import.meta.env.BASE_URL}" width="100%" height="700px" style="border:none; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);"></iframe>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    alert('Embed code copied to clipboard!');
  };

  if (status !== 'finished') return null;

  return (
    <div className="min-h-screen w-full bg-background flex justify-center p-4 sm:p-6 overflow-y-auto">
      
      {/* Dynamic background based on final AQI */}
      <div 
        className="fixed inset-0 z-0 opacity-30 pointer-events-none"
        style={{ 
          background: aqi > 100 
            ? 'radial-gradient(circle at top right, hsl(20 15% 40%), transparent)' 
            : 'radial-gradient(circle at top right, hsl(200 90% 80%), transparent)'
        }}
      />

      <div className="max-w-4xl w-full z-10 py-6 sm:py-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-[2rem] p-6 sm:p-10 flex flex-col items-center"
        >
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <GradeIcon className={`w-12 h-12 ${gradeColor}`} />
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold text-muted-foreground mb-1">Game Over, {playerName}!</h2>
          <h1 className={`font-display text-4xl sm:text-5xl md:text-6xl font-black mb-6 text-center ${gradeColor}`}>
            {gradeTitle}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
            {/* Score Card */}
            <div className="flex flex-col items-center justify-center bg-white/60 dark:bg-slate-800/60 rounded-3xl p-8 border border-border shadow-sm">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Final Score</span>
              <span className="font-display text-7xl font-black text-foreground">{score}</span>
              <div className="flex gap-4 mt-6 w-full justify-center">
                <div className="flex items-center gap-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-4 py-1.5 rounded-full font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" /> {correctCount} Correct
                </div>
                <div className="flex items-center gap-1.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-4 py-1.5 rounded-full font-bold text-sm">
                  <XCircle className="w-4 h-4" /> {totalItems - correctCount} Missed
                </div>
              </div>
            </div>

            {/* AQI Result Card */}
            <div className="flex flex-col items-center justify-center bg-white/60 dark:bg-slate-800/60 rounded-3xl p-8 border border-border shadow-sm">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6">City Air Quality</span>
              <div className="w-full px-4">
                <AQIMeter aqi={aqi} />
              </div>
              <p className="mt-6 text-center text-sm text-muted-foreground font-medium">
                {aqi <= 50 ? "Excellent work! Your city breathes easy." : 
                 aqi <= 100 ? "Not bad, but room for improvement." : 
                 "Warning! High pollution levels reached."}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row gap-4 mb-10">
            <button
              onClick={handlePlayAgain}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg bg-foreground text-background hover:bg-foreground/90 transition-all shadow-[0_6px_0_0_rgba(0,0,0,0.2)] hover:translate-y-1 hover:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] active:translate-y-2 active:shadow-none"
            >
              <RotateCcw className="w-5 h-5" /> Play Again
            </button>
            <button
              onClick={() => setShowEmbed(!showEmbed)}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all border-2 border-border shadow-sm hover:translate-y-1"
            >
              <Share2 className="w-5 h-5" /> Embed Game
            </button>
          </div>

          {/* Embed Code Dropdown */}
          <AnimatePresence>
            {showEmbed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full mb-8 overflow-hidden"
              >
                <div className="bg-slate-900 rounded-3xl p-6 relative group border border-slate-700">
                  <div className="flex items-center gap-2 text-slate-400 mb-3 text-sm font-bold uppercase tracking-wider">
                    <Code className="w-4 h-4" /> Embed on your website
                  </div>
                  <pre className="text-green-400 font-mono text-sm overflow-x-auto p-4 bg-black/50 rounded-xl leading-relaxed">
                    {embedCode}
                  </pre>
                  <button 
                    onClick={copyEmbed}
                    className="mt-4 w-full bg-slate-800 text-white hover:bg-slate-700 py-3 rounded-xl font-bold transition-colors border border-slate-600"
                  >
                    Copy HTML Code
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Review Section */}
          <div className="w-full mt-4">
            <h3 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
              <Wind className="w-6 h-6 text-primary" /> Sort Review
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar pb-4">
              {history.map((h, i) => (
                <div key={i} className={`flex flex-col p-4 rounded-2xl border-2 ${h.isCorrect ? 'bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-900/30' : 'bg-red-50/50 border-red-200 dark:bg-red-900/10 dark:border-red-900/30'}`}>
                  <div className="flex items-start gap-3">
                    <div className="text-3xl bg-white dark:bg-slate-800 rounded-xl p-2 shadow-sm">{h.item.emoji}</div>
                    <div className="flex flex-col flex-1 min-w-0 pt-1">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-foreground truncate text-lg">{h.item.name}</span>
                        {h.isCorrect ? 
                          <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" /> : 
                          <XCircle className="w-6 h-6 text-red-500 shrink-0" />
                        }
                      </div>
                      <span className="text-sm font-medium text-muted-foreground mt-1">
                        Placed in: <span className="uppercase text-xs tracking-wider border px-2 py-0.5 rounded-md bg-white/50">{h.zone}</span>
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-foreground/80 bg-white/40 dark:bg-black/20 p-3 rounded-xl border border-border/50">
                    {h.isCorrect ? h.item.funFact : (h.item.wrongReason || 'Incorrect sort.')}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
