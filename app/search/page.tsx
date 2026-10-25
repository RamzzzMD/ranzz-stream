import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { search } from '@/lib/idlix';
import CardPoster from '@/components/home/CardPoster';
import { Search as SearchIcon, AlertCircle } from 'lucide-react';
import type { MediaItem } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Pencarian Media | RANZZ STREAM',
  description: 'Cari film, serial, anime, dan drakor favorit Anda di RANZZ STREAM.',
};

interface SearchPageProps {
  searchParams: {
    q?: string;
    tab?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q ? searchParams.q.trim() : '';
  const tab = searchParams.tab || 'all';

  let results: MediaItem[] = [];

  if (query) {
    try {
      const res = await search(query);
      if (Array.isArray(res)) {
        results = res;
      }
    } catch (err) {
      console.error('Search error:', err);
    }
  }

  const filtered = results.filter((item) => {
    if (tab === 'movie') return item.contentType === 'movie';
    if (tab === 'series') return item.contentType === 'tv_series' || item.contentType === 'series';
    return true;
  });

  const movieCount = results.filter((i) => i.contentType === 'movie').length;
  const seriesCount = results.filter((i) => i.contentType === 'tv_series' || i.contentType === 'series').length;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 w-full min-h-screen">
      {/* Category Pills Nav */}
      <div className="flex items-center gap-2 overflow-x-auto pb-6 pt-2 no-scrollbar">
        <Link
          href="/collections"
          className="px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 hover:text-white transition-colors whitespace-nowrap"
        >
          Semua Koleksi
        </Link>
        <Link
          href="/kdrama"
          className="px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 hover:text-white transition-colors whitespace-nowrap"
        >
          Drama Korea
        </Link>
        <Link
          href="/movies"
          className="px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 hover:text-white transition-colors whitespace-nowrap"
        >
          Film
        </Link>
        <Link
          href="/series"
          className="px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 hover:text-white transition-colors whitespace-nowrap"
        >
          Serial TV
        </Link>
        <Link
          href="/anime"
          className="px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 hover:text-white transition-colors whitespace-nowrap"
        >
          Anime
        </Link>
      </div>

      {/* Search Header */}
      <div className="max-w-2xl mx-auto mb-10 text-center space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          <span className="w-1 h-4 bg-[#e50914] rounded-full inline-block" />
          <SearchIcon className="w-3.5 h-3.5 text-zinc-400" />
          <span>Pencarian Cepat</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Cari Film, Serial & Anime
        </h1>
        <p className="text-sm text-zinc-400 font-light">
          Ketik judul film, serial, anime, atau judul favorit yang ingin Anda tonton.
        </p>

        {/* Search Bar Input Form */}
        <form action="/search" method="GET" className="relative flex items-center max-w-xl mx-auto pt-3">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Ketik judul: Avatar, Queen of Tears, One Piece..."
            className="w-full pl-11 pr-24 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
            autoFocus
          />
          <SearchIcon className="w-4 h-4 text-zinc-500 absolute left-3.5 pointer-events-none" />
          <button
            type="submit"
            className="btn-primary text-xs py-2 px-4 absolute right-1.5 rounded-md"
          >
            Cari
          </button>
        </form>
      </div>

      {/* Tabs Filter (All / Movies / Series) */}
      {query && (
        <div className="border-b border-zinc-800 pb-4 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link
              href={`/search?q=${encodeURIComponent(query)}&tab=all`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                tab === 'all'
                  ? 'bg-white text-black border-white'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              Semua ({results.length})
            </Link>
            <Link
              href={`/search?q=${encodeURIComponent(query)}&tab=movie`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                tab === 'movie'
                  ? 'bg-white text-black border-white'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              Film ({movieCount})
            </Link>
            <Link
              href={`/search?q=${encodeURIComponent(query)}&tab=series`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                tab === 'series'
                  ? 'bg-white text-black border-white'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              Serial TV ({seriesCount})
            </Link>
          </div>

          <p className="text-xs text-zinc-400 font-light">
            Menampilkan {filtered.length} hasil untuk &ldquo;<span className="text-white font-medium">{query}</span>&rdquo;
          </p>
        </div>
      )}

      {/* Hasil Pencarian */}
      {query ? (
        filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {filtered.map((item, idx) => (
              <CardPoster key={item.id || idx} item={item} priority={idx < 6} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-900 rounded-xl border border-zinc-800 p-8 max-w-md mx-auto space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 mb-2">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-white">
              Tidak Ada Hasil Ditemukan
            </h2>
            <p className="text-xs text-zinc-400 font-light">
              Periksa ejaan kata kunci Anda atau coba cari judul lain.
            </p>
          </div>
        )
      ) : (
        <div className="text-center py-20 text-zinc-500 text-xs font-light">
          <p>
            Masukkan judul film atau serial pada kolom pencarian di atas untuk memulai.
          </p>
        </div>
      )}
    </div>
  );
}
