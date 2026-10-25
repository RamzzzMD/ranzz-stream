'use client';

import React from 'react';
import { SkipForward } from 'lucide-react';

interface NextEpisodeProps {
  onNext: () => void;
  nextTitle?: string;
}

export default function NextEpisode({ onNext, nextTitle }: NextEpisodeProps) {
  return (
    <button
      onClick={onNext}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors text-xs font-medium"
      aria-label="Putar episode berikutnya"
      title={nextTitle ? `Episode Berikutnya: ${nextTitle}` : 'Episode Berikutnya'}
    >
      <SkipForward className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">Episode Berikutnya</span>
    </button>
  );
}
