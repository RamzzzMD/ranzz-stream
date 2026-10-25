'use client';

import React from 'react';
import { Check } from 'lucide-react';
import type { SubtitleOption } from '@/lib/types';

interface SubtitleMenuProps {
  subtitles: SubtitleOption[];
  activeSubtitle: string | null;
  onSelect: (lang: string | null) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function SubtitleMenu({
  subtitles,
  activeSubtitle,
  onSelect,
  isOpen,
  onClose,
}: SubtitleMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      className="absolute bottom-12 right-0 w-44 rounded-lg bg-zinc-900 border border-zinc-800 p-1.5 shadow-xl z-50 animate-in fade-in"
      onMouseLeave={onClose}
    >
      <div className="px-2 py-1 border-b border-zinc-800 mb-1">
        <span className="text-[11px] font-semibold text-zinc-400">
          Subtitle
        </span>
      </div>

      <div className="space-y-0.5">
        <button
          onClick={() => {
            onSelect(null);
            onClose();
          }}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeSubtitle === null
              ? 'bg-zinc-800 text-white font-semibold'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
          }`}
        >
          <span>Nonaktif</span>
          {activeSubtitle === null && <Check className="w-3.5 h-3.5 text-white" />}
        </button>

        {subtitles.map((sub, idx) => {
          const isSelected = activeSubtitle === sub.lang;
          return (
            <button
              key={idx}
              onClick={() => {
                onSelect(sub.lang);
                onClose();
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                isSelected
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <span>{sub.label || sub.lang}</span>
              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
