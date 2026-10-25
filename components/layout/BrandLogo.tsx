'use client';

import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  showWordmark?: boolean;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function BrandLogo({
  showWordmark = true,
  showTagline = false,
  size = 'md',
  className = '',
}: BrandLogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const wordmarkSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
  };

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 group cursor-pointer select-none transition-opacity hover:opacity-90 ${className}`}
      aria-label="RANZZ STREAM Beranda"
    >
      {/* Minimalist Emblem: Sleek dark rounded square with sharp R */}
      <div
        className={`relative ${iconSizes[size]} flex-shrink-0 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-700/80 text-white font-extrabold tracking-wider transition-colors group-hover:border-zinc-500 overflow-hidden shadow-sm`}
      >
        <span className="text-[#e50914] font-black">R</span>
      </div>

      {/* Clean Typography */}
      {showWordmark && (
        <div className="flex flex-col">
          <div className={`font-sans font-bold tracking-tight ${wordmarkSizes[size]} text-white flex items-center leading-none`}>
            <span>RANZZ</span>
            <span className="text-[#e50914] ml-1 font-semibold">STREAM</span>
          </div>

          {showTagline ? (
            <span className="text-[10px] font-medium text-zinc-400 tracking-wider uppercase mt-1">
              Neon Nights. Infinite Stories.
            </span>
          ) : null}
        </div>
      )}
    </Link>
  );
}
