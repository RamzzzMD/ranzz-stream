'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import NeonPlayer from '@/components/player/NeonPlayer';
import { AlertCircle, ArrowLeft, RotateCcw, Tv, Film } from 'lucide-react';
import type { StreamData } from '@/lib/types';

interface WatchClientProps {
  slug: string;
  type: string;
  season: number;
  episode: number;
  contentId?: string;
  initialMediaTitle: string;
  nextEpisodeHref?: string;
  nextEpisodeTitle?: string;
}

export default function WatchClient({
  slug,
  type,
  season,
  episode,
  contentId,
  initialMediaTitle,
  nextEpisodeHref,
  nextEpisodeTitle,
}: WatchClientProps) {
  const [streamData, setStreamData] = useState<StreamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(20);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStream = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setProgress(20);

    const query = new URLSearchParams({
      target: slug,
      type,
      season: String(season),
      episode: String(episode),
      ...(contentId ? { id: contentId } : {}),
    }).toString();

    try {
      const res = await fetch(`/api/watch?${query}`);
      const json = await res.json();

      if (!res.ok || !json.ok || !json.data) {
        throw new Error(json.error || 'Sumber video tidak dapat dimuat');
      }

      setProgress(100);
      setTimeout(() => {
        setStreamData(json.data);
        setIsLoading(false);
      }, 250);
    } catch (err: any) {
      console.error('Fetch stream error:', err);
      setErrorMessage(err?.message || 'Gagal memuat tayangan');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStream();
  }, [slug, type, season, episode, contentId]);

  // Smooth progress animation
  useEffect(() => {
    if (!isLoading) return;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) {
          return prev + Math.floor(Math.random() * 8 + 4);
        }
        return prev;
      });
    }, 800);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLoading]);

  const isSeries = type === 'series';
  const backHref = isSeries ? `/series/${slug}` : `/movie/${slug}`;

  // ─── ERROR STATE ───
  if (errorMessage && !streamData) {
    return (
      <div className="min-h-[500px] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center space-y-4 shadow-lg">
          <div className="w-12 h-12 mx-auto rounded-full bg-red-950/60 border border-red-800/60 flex items-center justify-center text-[#e50914]">
            <AlertCircle className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-bold text-white">
              Video Tidak Dapat Diputar
            </h1>
            <p className="text-xs text-zinc-400">
              Terjadi kendala saat menyambungkan pemutaran video.
            </p>
          </div>

          <p className="text-xs text-zinc-500 leading-relaxed">
            {errorMessage}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
            <button
              onClick={fetchStream}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#e50914] hover:bg-red-700 text-white text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Coba Lagi</span>
            </button>
            <Link
              href={backHref}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium border border-zinc-700/60 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── MINIMALIST LOADER ───
  if (isLoading || !streamData) {
    return (
      <div className="relative w-full aspect-video bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800/80 flex flex-col items-center justify-center p-6 select-none">
        <div className="w-10 h-10 mb-4 rounded-full border-2 border-zinc-700 border-t-white animate-spin" />

        <div className="text-center max-w-sm space-y-1.5 z-10">
          <h2 className="text-base sm:text-lg font-bold text-white">
            {initialMediaTitle}
          </h2>
          <p className="text-xs text-zinc-400">
            Menyiapkan pemutaran video...
          </p>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-full max-w-xs mt-5 space-y-1.5 z-10">
          <div className="h-1 w-full rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#e50914] transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-center text-[10px] text-zinc-500">
            Memuat subtitle dan resolusi otomatis
          </p>
        </div>
      </div>
    );
  }

  // ─── PLAYER RENDERED ───
  return (
    <div className="w-full space-y-4">
      <NeonPlayer
        src={streamData.masterManifest}
        title={streamData.title || initialMediaTitle}
        qualities={streamData.qualities}
        subtitles={streamData.subtitles}
        expiresAt={streamData.expiresAt}
        watermark="RANZZ · ranzzajaah.bio"
        nextEpisodeHref={nextEpisodeHref}
        nextEpisodeTitle={nextEpisodeTitle}
      />

      {/* Info Card Below Player */}
      <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
            {isSeries ? <Tv className="w-3.5 h-3.5 text-[#e50914]" /> : <Film className="w-3.5 h-3.5 text-[#e50914]" />}
            <span>{isSeries ? `Serial TV • Musim ${season} Episode ${episode}` : 'Film Bioskop'}</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white">
            {streamData.title || initialMediaTitle}
          </h1>
          <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
            Pintasan: <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px]">Spasi</kbd> Putar/Jeda, <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px]">← / →</kbd> 10s, <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px]">&gt; / &lt;</kbd> Kecepatan, <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px]">F</kbd> Layar Penuh.
          </p>
        </div>

        {nextEpisodeHref && (
          <Link
            href={nextEpisodeHref}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#e50914] hover:bg-red-700 text-white text-xs font-semibold whitespace-nowrap self-start md:self-auto transition-colors"
          >
            <span>Episode Berikutnya</span>
            <span>→</span>
          </Link>
        )}
      </div>
    </div>
  );
}
