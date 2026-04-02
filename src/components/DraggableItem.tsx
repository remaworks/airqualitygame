import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { AirQualityItem } from '@/data/air-quality-data';

interface DraggableItemProps {
  item: AirQualityItem;
}

export function DraggableItem({ item }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: item,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        touch-none cursor-grab active:cursor-grabbing
        flex flex-col items-center justify-center
        w-40 h-48 sm:w-48 sm:h-56 md:w-56 md:h-64
        bg-card rounded-3xl border border-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]
        transition-all duration-200 relative overflow-hidden
        ${isDragging ? 'shadow-2xl ring-4 ring-primary/30 rotate-3 z-50 opacity-95 scale-105' : 'hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)]'}
      `}
    >
      {/* Subtle top glare */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
      
      <span className="text-6xl sm:text-7xl md:text-8xl drop-shadow-xl mb-3 pointer-events-none transform transition-transform group-hover:scale-110">
        {item.emoji}
      </span>
      
      <div className="flex flex-col items-center px-4 w-full">
        <span className="font-display font-black text-lg sm:text-xl text-card-foreground text-center leading-tight mb-1 pointer-events-none">
          {item.name}
        </span>
        <span className="text-xs sm:text-sm text-muted-foreground text-center font-medium line-clamp-2 pointer-events-none">
          {item.description}
        </span>
      </div>
    </div>
  );
}
