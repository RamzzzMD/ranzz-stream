'use client';

import { useMemo } from 'react';

export default function StarField() {
  const stars = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      left: `${(i * 23) % 100}%`,
      top: `${(i * 17) % 65}%`,
      size: (i % 3) + 1,
      duration: 2 + (i % 4),
      delay: (i % 5) * 0.5,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden" aria-hidden="true">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white opacity-40 animate-twinkle"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
            boxShadow: `0 0 6px rgba(0, 240, 255, 0.8)`,
          }}
        />
      ))}
    </div>
  );
}
