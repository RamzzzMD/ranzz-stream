'use client';

import { useEffect } from 'react';

interface StreamPreloaderProps {
  slug: string;
  type: 'movie' | 'series';
  season?: number;
  episode?: number;
  id?: string;
}

export default function StreamPreloader({
  slug,
  type,
  season = 1,
  episode = 1,
  id,
}: StreamPreloaderProps) {
  useEffect(() => {
    // Jalankan pre-warming stream gate secara hening di background
    const timer = setTimeout(() => {
      const query = new URLSearchParams({
        target: slug,
        type,
        season: String(season),
        episode: String(episode),
        ...(id ? { id } : {}),
      }).toString();

      fetch(`/api/watch?${query}`, { method: 'GET', priority: 'low' as any }).catch(() => {
        // Abaikan jika pre-warm gagal atau ditutup
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, [slug, type, season, episode, id]);

  return null;
}
