import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Wind, AlertTriangle, Flame } from 'lucide-react';

interface AQIMeterProps {
  aqi: number;
}

export function AQIMeter({ aqi }: AQIMeterProps) {
  // Determine color and status based on US EPA AQI standard (simplified)
  let statusText = 'Good';
  let colorClass = 'bg-green-500';
  let textColorClass = 'text-green-700 dark:text-green-400';
  let Icon = Wind;

  if (aqi > 150) {
    statusText = 'Unhealthy';
    colorClass = 'bg-red-500';
    textColorClass = 'text-red-700 dark:text-red-400';
    Icon = Flame;
  } else if (aqi > 100) {
    statusText = 'Sensitive';
    colorClass = 'bg-orange-500';
    textColorClass = 'text-orange-700 dark:text-orange-400';
    Icon = AlertTriangle;
  } else if (aqi > 50) {
    statusText = 'Moderate';
    colorClass = 'bg-yellow-400';
    textColorClass = 'text-yellow-700 dark:text-yellow-400';
    Icon = Cloud;
  }

  // Calculate percentage for the bar (0 to 200 scale mapped to 0-100%)
  const percentage = Math.min(100, Math.max(0, (aqi / 200) * 100));

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col gap-1.5">
      <div className="flex justify-between items-end px-1">
        <div className="flex items-center gap-1.5">
          <Icon className={`w-4 h-4 ${textColorClass}`} />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">AQI Meter</span>
        </div>
        <div className={`font-display font-black text-xl leading-none ${textColorClass}`}>
          {aqi} <span className="text-sm font-bold opacity-80">{statusText}</span>
        </div>
      </div>
      
      <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative shadow-inner">
        {/* Color zones background */}
        <div className="absolute inset-0 flex">
          <div className="h-full bg-green-500/20 w-[25%]" />
          <div className="h-full bg-yellow-400/20 w-[25%]" />
          <div className="h-full bg-orange-500/20 w-[25%]" />
          <div className="h-full bg-red-500/20 w-[25%]" />
        </div>
        
        {/* The actual moving indicator bar */}
        <motion.div 
          className={`h-full ${colorClass} shadow-[0_0_10px_rgba(0,0,0,0.2)]`}
          initial={{ width: '25%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
        
        {/* Threshold markers */}
        <div className="absolute inset-0 flex justify-between px-[25%] pointer-events-none">
          <div className="w-px h-full bg-white/50" />
          <div className="w-px h-full bg-white/50" />
          <div className="w-px h-full bg-white/50" />
        </div>
      </div>
    </div>
  );
}
