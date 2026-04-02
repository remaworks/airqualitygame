import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useGame } from '@/store/game-store';
import { Wind, Factory, Trees, Play } from 'lucide-react';

export default function Home() {
  const [, setLocation] = useLocation();
  const { playerName, setPlayerName, startGame } = useGame();
  const [error, setError] = useState('');

  const handlePlay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setError('Please enter your name to become a hero!');
      return;
    }
    startGame();
    setLocation('/play');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 relative overflow-hidden bg-gradient-to-br from-blue-50 to-slate-200 dark:from-slate-900 dark:to-slate-950">
      
      {/* Conceptual Background Image - Skyline */}
      <div 
        className="absolute inset-0 z-0 opacity-20 dark:opacity-10 mix-blend-multiply dark:mix-blend-screen"
        style={{ 
          backgroundImage: `url(${import.meta.env.BASE_URL}images/skyline-bg.png)`, 
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom'
        }}
      />
      
      {/* Decorative floating elements */}
      <motion.div animate={{ y: [0, -15, 0], x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} className="absolute top-20 left-[10%] opacity-20 pointer-events-none">
        <CloudSvg className="w-32 h-auto text-primary" />
      </motion.div>
      <motion.div animate={{ y: [0, 20, 0], x: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 2 }} className="absolute bottom-40 right-[5%] opacity-20 pointer-events-none">
        <SmogSvg className="w-48 h-auto text-destructive" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="glass-panel max-w-xl w-full rounded-[2rem] p-8 sm:p-12 relative z-10 flex flex-col items-center border border-white/60 dark:border-white/10"
      >
        <div className="flex gap-4 mb-6">
          <motion.div whileHover={{ scale: 1.1, rotate: 10 }} className="bg-primary/10 p-4 rounded-2xl">
            <Trees className="w-10 h-10 text-primary" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.1, rotate: -10 }} className="bg-destructive/10 p-4 rounded-2xl">
            <Factory className="w-10 h-10 text-destructive" />
          </motion.div>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-center font-black text-foreground mb-3 leading-tight">
          Air Quality <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-500">Sorter</span>
        </h1>
        
        <p className="text-muted-foreground text-center mb-8 text-lg font-medium leading-relaxed">
          Can you tell what cleans the air from what pollutes it? Sort the items before the smog rolls in!
        </p>

        <form onSubmit={handlePlay} className="w-full flex flex-col gap-5">
          <div className="w-full relative">
            <input
              type="text"
              placeholder="Enter your name..."
              value={playerName}
              onChange={(e) => { setPlayerName(e.target.value); setError(''); }}
              className={`
                w-full px-6 py-4 rounded-2xl font-sans text-lg
                bg-background/80 border-2 backdrop-blur-sm
                ${error ? 'border-destructive ring-4 ring-destructive/20' : 'border-border focus:border-primary focus:ring-4 focus:ring-primary/20'}
                text-foreground placeholder:text-muted-foreground
                focus:outline-none transition-all duration-300 shadow-inner
              `}
            />
            {error && (
              <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-sm mt-2 font-bold px-2 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {error}
              </motion.p>
            )}
          </div>

          <button
            type="submit"
            className="
              group w-full py-4 sm:py-5 rounded-2xl font-display font-bold text-2xl tracking-wide flex items-center justify-center gap-3
              bg-gradient-to-r from-primary to-primary/80
              text-primary-foreground shadow-[0_8px_0_0_hsl(200,90%,35%)]
              hover:-translate-y-1 hover:shadow-[0_12px_0_0_hsl(200,90%,35%)] hover:brightness-110
              active:translate-y-2 active:shadow-[0_0px_0_0_hsl(200,90%,35%)]
              transition-all duration-200
            "
          >
            START GAME <Play className="w-6 h-6 fill-current group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

      </motion.div>
    </div>
  );
}

// Simple inline SVG components for decoration
function CloudSvg(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.5 19c-2.485 0-4.5-2.015-4.5-4.5 0-2.046 1.365-3.774 3.235-4.321A6.974 6.974 0 0010 6c-3.866 0-7 3.134-7 7 0 3.866 3.134 7 7 7h7.5c1.381 0 2.5-1.119 2.5-2.5S18.881 19 17.5 19z" />
    </svg>
  );
}

function SmogSvg(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6 13c-1.657 0-3 1.343-3 3s1.343 3 3 3h12c2.21 0 4-1.79 4-4s-1.79-4-4-4c-.38 0-.745.053-1.094.152A5.986 5.986 0 0011 7c-3.314 0-6 2.686-6 6 0 .341.028.675.082 1.002A2.99 2.99 0 006 13zM4 10c0-1.105.895-2 2-2h1c1.105 0 2 .895 2 2" opacity="0.6"/>
      <path d="M10 5c0-1.105.895-2 2-2h1c1.105 0 2 .895 2 2" opacity="0.4"/>
    </svg>
  );
}
