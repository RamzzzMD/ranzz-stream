'use client';

import { useVisualFxStore } from '@/lib/store';

export default function Scanlines() {
  const scanlinesActive = useVisualFxStore((s) => s.scanlinesActive);
  if (!scanlinesActive) return null;

  return <div className="scanlines" aria-hidden="true" />;
}
