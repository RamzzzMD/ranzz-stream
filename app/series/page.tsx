import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getSeries, getSeriesFilterOptions } from '@/lib/idlix';
import CardPoster from '@/components/home/CardPoster';
import type { MediaItem } from '@/lib/types';
import { Tv, ChevronLeft, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Katalog Serial TV & Web Series | RANZZ STREAM',
  description:
    'Nonton maraton serial TV, drama, dan web series terbaik dunia dengan subtitle Indonesia lengkap di RANZZ STREAM.',
};

export const revalidate = 300;

interface SeriesPageProps {
  searchParams: {
    page?: string;
    sort?: string;
    genre?: string;
    country?: string;
    year?: string;
  };
}

export default async function SeriesPage({ searchParams }: SeriesPageProps) {
  const page = parseInt(searchParams.page || '1', 10);
  const sort = searchParams.sort || 'latest';
  const genre = searchParams.genre || '';
  const country = searchParams.country || '';
  const year = searchParams.year || '';

  const params: Record<string, string> = {
    page: String(page),
    sort,
  };
  if (genre) params.genre = genre;
  if (country) params.country = country;
  if (year) params.year = year;

  let seriesList: MediaItem[] = [];
  let totalPages = 1;
  let filterOptions: any = { genres: [], countries: [], years: [] };

  try {
    const [resSeries, resFilters] = await Promise.all([
      getSeries(params),
      getSeriesFilterOptions(),
    ]);

    if (resSeries?.data) {
      seriesList = resSeries.data;
      totalPages = resSeries.pagination?.totalPages || 1;
    }
    if (resFilters) {
      filterOptions = resFilters;
    }
  } catch (err) {
    console.error('Error loading series:', err);
  }

  const buildFilterUrl = (newParams: Record<string, string>) => {
    const combined = { ...params, ...newParams };
    const sp = new URLSearchParams();
    Object.entries(combined).forEach(([k, v]) => {
      if (v) sp.set(k, v);
    });
    return `/series?${sp.toString()}`;
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
        <span className="px-3.5 py-1.5 rounded-full bg-[#e50914] text-white text-xs font-medium whitespace-nowrap">
          Serial TV
        </span>
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
            <span className="w-1 h-4 bg-[#e50914] rounded-full" />
            <span>Katalog Serial TV</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Serial Televisi & Web Series
          </h1>
          <p className="text-sm text-zinc-400 mt-1 font-light">
            Temukan serial favorit dari seluruh dunia dengan rilis episode berkala dan subtitle Indonesia.
          </p>
        </div>

        {/* Filter Bar */}
        <form method="GET" action="/series" className="flex flex-wrap items-center gap-2">
          {/* Genre select */}
          <select
            name="genre"
            defaultValue={genre}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-normal text-zinc-200 focus:outline-none focus:border-zinc-600"
          >
            <option value="">Semua Genre</option>
            {filterOptions.genres?.map((g: any) => (
              <option key={g.id || g.slug} value={g.slug}>
                {g.name}
              </option>
            ))}
          </select>

          {/* Country select */}
          <select
            name="country"
            defaultValue={country}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-normal text-zinc-200 focus:outline-none focus:border-zinc-600"
          >
            <option value="">Semua Negara</option>
            {filterOptions.countries?.map((c: any) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Year select */}
          <select
            name="year"
            defaultValue={year}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-normal text-zinc-200 focus:outline-none focus:border-zinc-600"
          >
            <option value="">Semua Tahun</option>
            {filterOptions.years?.slice(0, 30).map((y: string) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* Sort select */}
          <select
            name="sort"
            defaultValue={sort}
            className="bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zinc-600"
          >
            <option value="latest">Terbaru</option>
            <option value="popularity">Paling Populer</option>
            <option value="rating">Rating Tertinggi</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium transition-colors border border-zinc-750"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Grid Poster Series */}
      {seriesList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {seriesList.map((item, idx) => (
            <CardPoster key={item.id || idx} item={item} priority={idx < 6} />
          ))}
        </div>
      ) : (
        <div className="p-16 rounded-xl bg-zinc-900 border border-zinc-800 text-center text-zinc-400 max-w-md mx-auto">
          <Tv className="w-10 h-10 mx-auto text-zinc-500 mb-3" />
          <h3 className="font-semibold text-white text-base">Tidak ada serial yang cocok</h3>
          <p className="text-xs text-zinc-400 mt-1 font-light">
            Coba sesuaikan filter genre atau negara untuk menampilkan judul serial lainnya.
          </p>
          <Link
            href="/series"
            className="inline-block mt-4 text-xs font-medium text-[#e50914] hover:underline"
          >
            Reset Semua Filter
          </Link>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-14 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={buildFilterUrl({ page: String(page - 1) })}
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
              href={buildFilterUrl({ page: String(page + 1) })}
              className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors flex items-center gap-1 text-xs font-medium"
            >
              <span>Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
