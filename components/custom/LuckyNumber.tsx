'use client';

import { useState } from 'react';

type LuckyNumberProps = {
  number: number;
  isActive: boolean;
  category: string;
  className?: string;
};

export function LuckyNumber({ number, isActive, category, className }: LuckyNumberProps) {
  const colorMap: Record<string, string> = {
    sell: 'oklch(0.8 0.2 90)',
    buy: 'oklch(0.5 0.2 240)',
    rent: 'oklch(0.5 0.2 20)',
    auction: 'rgb(147 51 234)',
  };

  const glowColor = colorMap[category] || 'oklch(0.8 0.2 90)';

  return (
    <span
      aria-hidden
      className={`absolute -left-4 -top-8 text-9xl font-extrabold select-none z-20 transition-colors w-fit line-height-[0.9] ${
        isActive ? 'glow' : 'text-foreground/60 dark:text-white/30'
      }`}
      style={isActive ? { '--glow-color': glowColor } as React.CSSProperties : {}}
    >
      {number}
    </span>
  );
}
