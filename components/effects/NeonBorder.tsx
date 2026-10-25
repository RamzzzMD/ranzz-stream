'use client';

import React from 'react';

interface NeonBorderProps {
  children: React.ReactNode;
  color?: 'pink' | 'cyan' | 'purple';
  className?: string;
}

export default function NeonBorder({
  children,
  color = 'pink',
  className = '',
}: NeonBorderProps) {
  const colorMap = {
    pink: 'border-neon-pink/40 hover:border-neon-pink hover:shadow-neon-pink',
    cyan: 'border-neon-cyan/40 hover:border-neon-cyan hover:shadow-neon-cyan',
    purple: 'border-neon-purple/40 hover:border-neon-purple hover:shadow-[0_0_20px_#b026ff]',
  };

  return (
    <div
      className={`rounded-lg border transition-all duration-300 backdrop-blur-md bg-elev-1/70 ${colorMap[color]} ${className}`}
    >
      {children}
    </div>
  );
}
