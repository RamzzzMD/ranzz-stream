import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getSeries, getMovies } from '@/lib/idlix';
import CardPoster from '@/components/home/CardPoster';
import type { MediaItem } from '@/lib/types';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Drama Korea (K-Drama) Terpopuler | RANZZ STREAM',
  description:
    'Streaming serial drama Korea terbaru, drakor romantis, thriller Korea, dan film Korea box office terlengkap di RANZZ STREAM.',
};

export const revalidate = 300;

interface KdramaPageProps {
  searchParams: {
    page?: string;
    sort?: string;
    type?: string;
  };
}

export default async function KdramaPage({ searchParams }: KdramaPageProps) {
  const page = parseInt(searchParams.page || '1', 10);
  const sort = searchParams.sort || 'popularity';
  const type = searchParams.type || 'all';

  let kdramaList: MediaItem[] = [];
  let totalPages = 1;

  try {
    if (type === 'movie') {
      const res = await getMovies({
        country: 'KR',
        page: String(page),
        sort,
      });
      kdramaList = res?.data || [];
      totalPages = res?.pagination?.totalPages || 1;
    } else if (type === 'series') {
      const res = await getSeries({
        country: 'KR',
        page: String(page),
        sort,
      });
      kdramaList = res?.data || [];
      totalPages = res?.pagination?.totalPages || 1;
    } else {
      const [resSeries, resMovies] = await Promise.all([
        getSeries({
          country: 'KR',
          page: String(page),
          sort,
        }),
        getMovies({
          country: 'KR',
          page: String(page),
          sort,
        }),
      ]);

      const seriesData = resSeries?.data || [];
      const moviesData = resMovies?.data || [];
      kdramaList = [...seriesData, ...moviesData];
      totalPages = Math.max(
        resSeries?.pagination?.totalPages || 1,
        resMovies?.pagination?.totalPages || 1
      );
    }
  } catch (err) {
    console.error('Error fetching kdrama data:', err);
  }

  const buildUrl = (p: number, t = type) => {
    return `/kdrama?page=${p}&sort=${sort}&type=${t}`;
  };

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
        <span className="px-3.5 py-1.5 rounded-full bg-[#e50914] text-white text-xs font-medium whitespace-nowrap">
          Drama Korea
        </span>
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

      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
            <span className="w-1 h-4 bg-[#e50914] rounded-full inline-block" />
            <Heart className="w-3.5 h-3.5 text-[#e50914]" />
            <span>K-Drama & Korean Cinema</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Drama Korea Populer
          </h1>
          <p className="text-sm text-zinc-400 mt-1 font-light">
            Kisah cinta emosional, misteri menegangkan, dan cerita kehidupan terbaik dari Korea Selatan.
          </p>
        </div>

        {/* Tab Filter Tipe */}
        <div className="flex items-center gap-2">
          <Link
            href={buildUrl(1, 'all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              type === 'all'
                ? 'bg-white text-black border-white'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            Semua
          </Link>
          <Link
            href={buildUrl(1, 'series')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              type === 'series'
                ? 'bg-white text-black border-white'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            Serial Drakor
          </Link>
          <Link
            href={buildUrl(1, 'movie')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              type === 'movie'
                ? 'bg-white text-black border-white'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            Film Korea
          </Link>
        </div>
      </div>

      {/* Grid Poster K-Drama */}
      {kdramaList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {kdramaList.map((item, idx) => (
            <CardPoster key={item.id || idx} item={item} priority={idx < 6} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-900 rounded-xl border border-zinc-800 p-8 max-w-md mx-auto">
          <p className="text-base font-semibold text-white">Tidak ada K-Drama ditemukan</p>
          <p className="text-xs text-zinc-400 mt-2 font-light">
            Silakan periksa koneksi atau coba muat ulang halaman.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-14 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={buildUrl(Math.max(1, page - 1))}
              className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors flex items-center gap-1 text-xs font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </Link>
          )}

          <div className="px-3.5 py-2 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs font-medium text-zinc-300">
            Halaman {page} dari {totalPages}
          </div>

          {page < totalPages && (
            <Link
              href={buildUrl(Math.min(totalPages, page + 1))}
              className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors flex items-center gap-1 text-xs font-medium"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
