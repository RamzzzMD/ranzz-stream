'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import type { MediaItem } from '@/lib/types';
import CardPoster from './CardPoster';

interface SectionRowProps {
  title: string;
  items: MediaItem[];
  viewAllHref?: string;
  badge?: string;
}

export default function SectionRow({
  title,
  items,
  viewAllHref,
  badge,
}: SectionRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const offset = direction === 'left' ? -600 : 600;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="relative py-3 my-1">
      {/* Header Baris */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-1 h-5 bg-[#e50914] rounded-sm" />
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>{title}</span>
            {badge && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60 uppercase">
                {badge}
              </span>
            )}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1 group"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}

          {/* Tombol Scroll */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => scroll('left')}
              className="w-7 h-7 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
              aria-label={`Gulir kiri ${title}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-7 h-7 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
              aria-label={`Gulir kanan ${title}`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Kontainer Baris Scroll Horizontal */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={scrollRef}
          className="flex items-start gap-3.5 overflow-x-auto no-scrollbar scroll-smooth pb-2 snap-x snap-mandatory"
        >
          {items.map((item, idx) => (
            <div key={item.id || idx} className="snap-start flex-shrink-0 w-36 sm:w-40 md:w-44 lg:w-48">
              <CardPoster item={item} priority={idx < 5} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
