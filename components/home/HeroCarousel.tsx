'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Bookmark, Check, ChevronLeft, ChevronRight, Star, Info } from 'lucide-react';
import type { MediaItem } from '@/lib/types';
import { useWatchlistStore } from '@/lib/store';
import { formatRating, formatYear } from '@/lib/utils';

interface HeroCarouselProps {
  items: MediaItem[];
}

export default function HeroCarousel({ items }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { has, toggle } = useWatchlistStore();

  const activeItem = items[activeIndex] || items[0];

  // Auto rotate carousel every 8 seconds
  useEffect(() => {
    if (!items || items.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [items]);

  if (!activeItem) return null;

  const isSaved = has(activeItem.id);
  const isSeries =
    activeItem.contentType === 'series' ||
    activeItem.contentType === 'tv_series' ||
    activeItem.contentType === 'tv' ||
    Boolean(activeItem.firstAirDate) ||
    Boolean(activeItem.numberOfSeasons);
  const isMovie = !isSeries;
  const watchHref = `/watch/${isMovie ? 'movie' : 'series'}/${activeItem.slug}?id=${activeItem.id}`;
  const detailHref = isMovie ? `/movie/${activeItem.slug}` : `/series/${activeItem.slug}`;

  const rating = formatRating(activeItem.voteAverage);
  const year = formatYear(activeItem.releaseDate || activeItem.firstAirDate);
  const backdropSrc = activeItem.backdropPath || activeItem.posterPath || '/placeholder-backdrop.png';

  return (
    <section className="relative w-full -mt-16 pt-16 bg-[#09090b] overflow-hidden min-h-[520px] lg:min-h-[620px] flex items-center">
      {/* Background Keyart Image */}
      <div className="absolute inset-0 z-0">
        {backdropSrc && (
          <Image
            src={backdropSrc}
            alt={activeItem.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top opacity-40 transition-opacity duration-700 ease-out"
          />
        )}

        {/* Clean Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/85 via-45% to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/80 via-transparent to-transparent" />
      </div>

      {/* Content Area */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 flex flex-col items-start justify-center">
        <div className="max-w-2xl space-y-3.5">
          {/* Subtle Tag */}
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700/60 text-xs text-zinc-300">
            <span className="font-semibold text-[#e50914]">•</span>
            <span className="text-[11px] font-medium tracking-wide">
              {isMovie ? 'Film Sorotan' : 'Serial Unggulan'}
            </span>
          </div>

          {/* Title Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            <span>{activeItem.title}</span>
          </h1>

          {/* Metadata Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-zinc-300">
            {rating !== 'N/A' && (
              <span className="px-2 py-0.5 rounded bg-zinc-800/90 text-amber-400 font-semibold flex items-center gap-1 border border-zinc-700/60">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{rating}</span>
              </span>
            )}
            <span className="px-2 py-0.5 rounded bg-zinc-800/90 font-medium border border-zinc-700/60">
              {year || '2025'}
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-800/90 font-medium border border-zinc-700/60">
              {activeItem.quality || 'HD'}
            </span>
          </div>

          {/* Overview */}
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed line-clamp-3 max-w-xl">
            {activeItem.overview ||
              'Nikmati streaming ribuan film dan serial pilihan dengan kualitas jernih dan alur cerita terbaik.'}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Play Button */}
            <Link
              href={watchHref}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-sm transition-colors"
              aria-label={`Mulai nonton ${activeItem.title}`}
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Putar Sekarang</span>
            </Link>

            {/* Watchlist Button */}
            <button
              onClick={() => toggle(activeItem)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-white font-medium text-sm border border-zinc-700/60 transition-colors"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Di Daftar Tonton</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Daftar Tonton</span>
                </>
              )}
            </button>

            {/* Detail Button */}
            <Link
              href={detailHref}
              className="inline-flex items-center justify-center gap-1.5 p-2.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-300 hover:text-white border border-zinc-700/60 transition-colors"
              title="Informasi Detail"
            >
              <Info className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Carousel Slide Indicators */}
        {items.length > 1 && (
          <div className="flex items-center gap-3 mt-8">
            <div className="flex items-center gap-1.5">
              {items.slice(0, 7).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === activeIndex
                      ? 'w-6 bg-white'
                      : 'w-2 bg-zinc-700 hover:bg-zinc-500'
                  }`}
                  aria-label={`Pindah ke slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1 ml-3">
              <button
                onClick={() =>
                  setActiveIndex((prev) => (prev - 1 + items.length) % items.length)
                }
                className="p-1.5 rounded-md bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                aria-label="Slide sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveIndex((prev) => (prev + 1) % items.length)}
                className="p-1.5 rounded-md bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                aria-label="Slide berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}