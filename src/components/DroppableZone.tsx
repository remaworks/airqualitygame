import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { Category, ZONES } from '@/data/air-quality-data';

interface DroppableZoneProps {
  category: Category;
  className?: string;
}

export function DroppableZone({ category, className = '' }: DroppableZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: category,
  });

  const zoneData = ZONES[category];

  return (
    <div ref={setNodeRef} className={`flex flex-col items-center ${className}`}>
      <motion.div
        animate={{
          scale: isOver ? 1.05 : 1,
          y: isOver ? -5 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`
          relative w-full h-full min-h-[140px] sm:min-h-[160px] md:min-h-[200px]
          rounded-3xl shadow-lg border-4 border-black/5
          flex flex-col items-center justify-center gap-2 p-4
          ${zoneData.colorClass}
          ${isOver ? `ring-8 ring-white/30 shadow-2xl brightness-110 z-10` : 'opacity-90 hover:opacity-100'}
          transition-all duration-200 overflow-hidden
        `}
      >
        {/* Animated pattern overlay for zones */}
        {category === 'pollutes' && (
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black via-transparent to-transparent pointer-events-none" />
        )}
        {category === 'cleans' && (
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
        )}
        
        <span className="text-4xl sm:text-5xl md:text-6xl drop-shadow-md z-10 pointer-events-none transition-transform">
          {zoneData.icon}
        </span>
        <span className="font-display font-bold text-sm sm:text-base md:text-lg lg:text-xl tracking-wide z-10 text-center leading-tight drop-shadow-md px-2 pointer-events-none">
          {zoneData.name}
        </span>
        
        {/* Glow indicator when dragging over */}
        {isOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-white/20 pointer-events-none"
          />
        )}
      </motion.div>
    </div>
  );
}
