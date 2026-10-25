'use client';

import React from 'react';
import { Check } from 'lucide-react';
import type { QualityOption } from '@/lib/types';

interface QualitySelectorProps {
  qualities: QualityOption[];
  currentQuality: string;
  onSelect: (url: string, qualityName: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function QualitySelector({
  qualities,
  currentQuality,
  onSelect,
  isOpen,
  onClose,
}: QualitySelectorProps) {
  if (!isOpen) return null;

  return (
    <div
      className="absolute bottom-12 right-0 w-40 rounded-lg bg-zinc-900 border border-zinc-800 p-1.5 shadow-xl z-50 animate-in fade-in"
      onMouseLeave={onClose}
    >
      <div className="px-2 py-1 border-b border-zinc-800 mb-1">
        <span className="text-[11px] font-semibold text-zinc-400">
          Kualitas Video
        </span>
      </div>

      <div className="space-y-0.5">
        <button
          onClick={() => {
            onSelect('auto', 'Otomatis');
            onClose();
          }}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
            currentQuality === 'auto'
              ? 'bg-zinc-800 text-white font-semibold'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
          }`}
        >
          <span>Auto</span>
          {currentQuality === 'auto' && <Check className="w-3.5 h-3.5 text-white" />}
        </button>

        {qualities.map((q, idx) => {
          const isSelected = currentQuality === q.quality;
          return (
            <button
              key={idx}
              onClick={() => {
                onSelect(q.url, q.quality);
                onClose();
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                isSelected
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <span>{q.quality}</span>
              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
