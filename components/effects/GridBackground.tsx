'use client';

import { useVisualFxStore } from '@/lib/store';

export default function GridBackground() {
  const gridActive = useVisualFxStore((s) => s.gridActive);

  if (!gridActive) return null;

  return (
    <>
      {/* Perspective Synthwave Grid */}
      <div className="synth-grid" aria-hidden="true" />
      {/* Ambient Horizon Glow */}
      <div
        className="fixed bottom-0 left-0 right-0 h-96 pointer-events-none -z-10"
        style={{
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(255, 46, 151, 0.22) 0%, rgba(176, 38, 255, 0.12) 35%, transparent 75%)',
        }}
        aria-hidden="true"
      />
    </>
  );
}
