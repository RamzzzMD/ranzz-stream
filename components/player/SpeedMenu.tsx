'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface SpeedMenuProps {
  currentSpeed: number;
  onSelect: (speed: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

const SPEED_OPTIONS = [
  { label: '0.5x', value: 0.5 },
  { label: '0.75x', value: 0.75 },
  { label: '1.0x (Normal)', value: 1.0 },
  { label: '1.25x', value: 1.25 },
  { label: '1.5x', value: 1.5 },
  { label: '1.75x', value: 1.75 },
  { label: '2.0x', value: 2.0 },
];

export default function SpeedMenu({
  currentSpeed,
  onSelect,
  isOpen,
  onClose,
}: SpeedMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      className="absolute bottom-12 right-0 w-36 rounded-lg bg-zinc-900 border border-zinc-800 p-1.5 shadow-xl z-50 animate-in fade-in"
      onMouseLeave={onClose}
    >
      <div className="px-2 py-1 border-b border-zinc-800 mb-1">
        <span className="text-[11px] font-semibold text-zinc-400">
          Kecepatan
        </span>
      </div>

      <div className="space-y-0.5">
        {SPEED_OPTIONS.map((opt) => {
          const isSelected = currentSpeed === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => {
                onSelect(opt.value);
                onClose();
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                isSelected
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <span>{opt.label}</span>
              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
