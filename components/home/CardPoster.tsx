'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Star, Plus, Check } from 'lucide-react';
import type { MediaItem } from '@/lib/types';
import { formatRating, formatYear } from '@/lib/utils';
import { useWatchlistStore } from '@/lib/store';

interface CardPosterProps {
  item: MediaItem;
  priority?: boolean;
}

export default function CardPoster({ item, priority = false }: CardPosterProps) {
  const { has, toggle } = useWatchlistStore();
  const isSaved = has(item.id);

  const isSeries =
    item.contentType === 'series' ||
    item.contentType === 'tv_series' ||
    item.contentType === 'tv' ||
    Boolean(item.firstAirDate) ||
    Boolean(item.numberOfSeasons);
  const isMovie = !isSeries;
  const detailHref = isMovie ? `/movie/${item.slug}` : `/series/${item.slug}`;

  const dateStr = item.releaseDate || item.firstAirDate;
  const year = formatYear(dateStr);
  const rating = formatRating(item.voteAverage);
  const posterSrc = item.posterPath || '/placeholder-poster.png';

  return (
    <div className="group relative flex flex-col bg-zinc-900/70 rounded-lg overflow-hidden border border-zinc-800/80 hover:border-zinc-700 transition-all duration-200 hover:-translate-y-1 select-none">
      {/* Poster Container (2:3 Aspect Ratio) */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
        {item.posterPath ? (
          <Image
            src={posterSrc}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 160px, (max-width: 768px) 180px, (max-width: 1024px) 210px, 240px"
            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
            priority={priority}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-400 p-3 text-center">
            <span className="text-xs font-semibold text-zinc-300">RANZZ</span>
            <span className="text-[10px] mt-1 line-clamp-2 text-zinc-400">{item.title}</span>
          </div>
        )}

        {/* Quality Badge (Left) */}
        <div className="absolute top-2 left-2 z-10 flex items-center">
          <span className="px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-zinc-300 border border-white/10 text-[10px] font-semibold uppercase tracking-wider">
            {item.quality || 'HD'}
          </span>
        </div>

        {/* Rating Badge (Right) */}
        {rating !== 'N/A' && (
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-amber-400 border border-white/10 text-[10px] font-semibold">
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            <span className="text-white text-[10px]">{rating}</span>
          </div>
        )}

        {/* Hover Center Play Button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-md transform scale-90 group-hover:scale-100 transition-transform duration-200">
            <Play className="w-4 h-4 fill-black ml-0.5" />
          </div>
        </div>

        {/* Watchlist Quick Toggle Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(item);
          }}
          className={`absolute bottom-2 right-2 z-20 p-1.5 rounded-md backdrop-blur-sm transition-all ${
            isSaved
              ? 'bg-[#e50914] text-white'
              : 'bg-black/70 text-zinc-300 border border-white/20 hover:border-white hover:text-white opacity-0 group-hover:opacity-100'
          }`}
          aria-label={isSaved ? 'Hapus dari daftar tonton' : 'Tambah ke daftar tonton'}
          title={isSaved ? 'Tersimpan di daftar tonton' : 'Simpan ke daftar tonton'}
        >
          {isSaved ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </button>

        {/* Clickable Overlay Link */}
        <Link
          href={detailHref}
          className="absolute inset-0 z-10"
          aria-label={`Buka detail ${item.title}`}
        />
      </div>

      {/* Info Card Content */}
      <div className="p-2.5 flex flex-col justify-between flex-1">
        <Link
          href={detailHref}
          className="font-semibold text-xs sm:text-sm text-zinc-200 hover:text-white transition-colors line-clamp-1 leading-snug"
          title={item.title}
        >
          {item.title}
        </Link>
        <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1">
          <span>{year || '2025'}</span>
          <span className="text-zinc-500 uppercase text-[10px]">
            {isMovie ? 'Film' : 'Series'}
          </span>
        </div>
      </div>
    </div>
  );
}
