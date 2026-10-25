import React from 'react';
import HeroCarousel from '@/components/home/HeroCarousel';
import SectionRow from '@/components/home/SectionRow';
import {
  getHome,
  getLatestMovies,
  getLatestSeries,
  getMovies,
  getSeries,
  getCollections,
} from '@/lib/idlix';
import { FALLBACK_TRENDING } from '@/lib/fallback-data';
import type { MediaItem } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Film, Tv, Clapperboard, Star } from 'lucide-react';

export const revalidate = 300; // 5 menit cache

const QUICK_CATEGORIES = [
  { label: 'Semua Konten', href: '/collections', icon: Sparkles, count: '1.4k+' },
  { label: 'Drama Korea', href: '/kdrama', icon: Tv, count: '450+' },
  { label: 'Film Bioskop', href: '/movies', icon: Film, count: '800+' },
  { label: 'Serial TV', href: '/series', icon: Clapperboard, count: '320+' },
  { label: 'Anime', href: '/anime', icon: Star, count: '280+' },
];

export default async function HomePage() {
  let homeData: any = null;
  let latestMovies: MediaItem[] = [];
  let latestSeries: MediaItem[] = [];
  let kdramaItems: MediaItem[] = [];
  let animeItems: MediaItem[] = [];
  let collectionsList: any[] = [];
  let heroItems: MediaItem[] = [];

  try {
    const [homeRes, moviesRes, seriesRes, kdramaRes, animeRes, colRes] =
      await Promise.allSettled([
        getHome(),
        getLatestMovies(1),
        getLatestSeries(1),
        getMovies({ country: 'KR', sort: 'popularity' }),
        getSeries({ genre: 'animation', country: 'JP', sort: 'popularity' }),
        getCollections(),
      ]);

    if (homeRes.status === 'fulfilled' && homeRes.value) {
      homeData = homeRes.value;
      const featuredSec = homeData.above?.find((s: any) => s.type === 'featured');
      if (featuredSec?.data) {
        heroItems = featuredSec.data.map((item: any) => item.content || item);
      }
      if (!heroItems || heroItems.length === 0) {
        const trendingSec = homeData.above?.find((s: any) => s.type === 'trending');
        if (trendingSec?.data) heroItems = trendingSec.data;
      }
    }

    if (moviesRes.status === 'fulfilled' && moviesRes.value?.data) {
      latestMovies = moviesRes.value.data;
    }
    if (seriesRes.status === 'fulfilled' && seriesRes.value?.data) {
      latestSeries = seriesRes.value.data;
    }
    if (kdramaRes.status === 'fulfilled' && kdramaRes.value?.data) {
      kdramaItems = kdramaRes.value.data;
    }
    if (animeRes.status === 'fulfilled' && animeRes.value?.data) {
      animeItems = animeRes.value.data;
    }
    if (colRes.status === 'fulfilled' && colRes.value?.collections) {
      collectionsList = colRes.value.collections;
    }
  } catch (err) {
    console.error('Error fetching home page data:', err);
  }

  // Fallback data
  if (!heroItems || heroItems.length === 0) {
    heroItems = FALLBACK_TRENDING;
  }
  if (!latestMovies || latestMovies.length === 0) {
    latestMovies = FALLBACK_TRENDING.filter((m) => m.contentType === 'movie');
  }
  if (!latestSeries || latestSeries.length === 0) {
    latestSeries = FALLBACK_TRENDING.filter((m) => m.contentType === 'tv_series');
  }

  const trendingItems: MediaItem[] =
    homeData?.above?.find((s: any) => s.slug === 'trending-now')?.data ||
    homeData?.above?.find((s: any) => s.type === 'trending')?.data ||
    heroItems;

  return (
    <div className="flex flex-col min-h-screen bg-[#09090b]">
      {/* 1. Hero Featured Premiere */}
      <HeroCarousel items={heroItems} />

      {/* Main Body Container */}
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-6 z-20 space-y-6 pb-16">
        {/* Quick Category Filter Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
          {QUICK_CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                href={cat.href}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-medium text-zinc-300 hover:text-white transition-colors whitespace-nowrap"
              >
                <Icon className="w-3.5 h-3.5 text-zinc-400" />
                <span>{cat.label}</span>
                <span className="text-[10px] text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded">
                  {cat.count}
                </span>
              </Link>
            );
          })}
        </div>

        {/* 2. Populer Hari Ini */}
        <SectionRow
          title="Populer Hari Ini"
          items={trendingItems}
          viewAllHref="/movies?sort=popularity"
        />

        {/* 3. Drama Korea & Asia Unggulan */}
        {kdramaItems.length > 0 && (
          <SectionRow
            title="Drama Korea Pilihan"
            items={kdramaItems}
            viewAllHref="/kdrama"
          />
        )}

        {/* 4. Film Layar Lebar Terbaru */}
        <SectionRow
          title="Film Terbaru"
          items={latestMovies}
          viewAllHref="/movies"
        />

        {/* 5. Serial TV */}
        <SectionRow
          title="Serial TV"
          items={latestSeries}
          viewAllHref="/series"
        />

        {/* 6. Anime Spotlight */}
        {animeItems.length > 0 && (
          <SectionRow
            title="Anime Populer"
            items={animeItems}
            viewAllHref="/anime"
          />
        )}

        {/* 7. Waralaba & Koleksi Pilihan */}
        {collectionsList.length > 0 && (
          <section className="py-3 my-1">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-1 h-5 bg-[#e50914] rounded-sm" />
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  Waralaba & Koleksi
                </h2>
              </div>
              <Link
                href="/collections"
                className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Lihat Semua Koleksi →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
              {collectionsList.slice(0, 6).map((col: any) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.slug}`}
                  className="group relative rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div className="aspect-[16/10] relative bg-zinc-950">
                    <Image
                      src={col.backdropPath || col.posterPath || '/placeholder-backdrop.png'}
                      alt={col.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
                  </div>
                  <div className="p-2.5 flex flex-col justify-end">
                    <span className="font-semibold text-xs text-zinc-200 group-hover:text-white transition-colors line-clamp-1">
                      {col.title}
                    </span>
                    <span className="text-[10px] text-zinc-400 mt-0.5">
                      {col.itemCount || 0} Judul
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
