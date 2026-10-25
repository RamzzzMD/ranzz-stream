'use client';

import React from 'react';

interface GlitchTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'span';
  className?: string;
}

export default function GlitchText({
  text,
  as: Component = 'span',
  className = '',
}: GlitchTextProps) {
  return (
    <Component
      data-text={text}
      className={`relative inline-block font-display tracking-wider font-extrabold uppercase select-none text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan drop-shadow-[0_0_12px_rgba(255,46,151,0.6)] ${className}`}
    >
      {text}
    </Component>
  );
}
