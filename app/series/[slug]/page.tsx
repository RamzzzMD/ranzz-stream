import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSeriesDetail, getSeasonEpisodes, getRelated } from '@/lib/idlix';
import { Play, Bookmark, Star, Calendar, ArrowLeft, Share2, Sparkles, Tv, Clock } from 'lucide-react';
import SectionRow from '@/components/home/SectionRow';
import StreamPreloader from '@/components/player/StreamPreloader';
import { formatRating, formatYear } from '@/lib/utils';
import type { MediaItem } from '@/lib/types';

interface SeriesDetailPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    season?: string;
  };
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: SeriesDetailPageProps): Promise<Metadata> {
  try {
    const series = await getSeriesDetail(params.slug);
    if (!series) {
      return { title: 'Serial Tidak Ditemukan | RANZZ STREAM' };
    }
    const posterUrl = series.posterPath
      ? `https://image.tmdb.org/t/p/w780${series.posterPath}`
      : undefined;

    return {
      title: `${series.title} - Nonton Serial & Drama Sub Indo`,
      description:
        series.overview ||
        `Saksikan episode lengkap drama serial ${series.title} di RANZZ STREAM.`,
      openGraph: {
        title: `${series.title} | RANZZ STREAM`,
        description: series.overview,
        images: posterUrl ? [{ url: posterUrl }] : [],
      },
    };
  } catch {
    return { title: 'Nonton Serial TV | RANZZ STREAM' };
  }
}

export default async function SeriesDetailPage({
  params,
  searchParams,
}: SeriesDetailPageProps) {
  let series: any = null;
  let seasonData: any = null;
  let related: MediaItem[] = [];

  const currentSeason = parseInt(searchParams.season || '1', 10);

  try {
    const [seriesRes, seasonRes, relatedRes] = await Promise.allSettled([
      getSeriesDetail(params.slug),
      getSeasonEpisodes(params.slug, currentSeason),
      getRelated(params.slug, 'series'),
    ]);

    if (seriesRes.status === 'fulfilled' && seriesRes.value) {
      series = seriesRes.value;
    }
    if (seasonRes.status === 'fulfilled' && seasonRes.value) {
      seasonData = seasonRes.value;
    }
    if (relatedRes.status === 'fulfilled' && Array.isArray(relatedRes.value)) {
      related = relatedRes.value;
    }
  } catch (err) {
    console.error('Error loading series detail:', err);
  }

  if (!series || !series.title) {
    notFound();
  }

  const rating = formatRating(series.voteAverage);
  const year = formatYear(series.firstAirDate);
  const backdropSrc = series.backdropPath || series.posterPath;
  const posterSrc = series.posterPath || '/placeholder-poster.png';
  const totalSeasons = series.numberOfSeasons || 1;
  const episodes: any[] = seasonData?.season?.episodes || [];

  const firstEpId = episodes[0]?.id || series.id;
  const playFirstHref = `/watch/series/${series.slug}?season=1&episode=1${firstEpId ? `&id=${firstEpId}` : ''}`;

  const genres = Array.isArray(series.genres)
    ? series.genres
    : series.genres
    ? [series.genres]
    : [];

  return (
    <div className="min-h-screen pb-20 bg-[#09090b]">
      {/* Background Hero Layer */}
      <div className="relative w-full min-h-[500px] lg:min-h-[580px] flex items-end">
        {backdropSrc && (
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <Image
              src={backdropSrc}
              alt={series.title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-top opacity-25 filter blur-[0.5px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/70 to-transparent" />
          </div>
        )}

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 w-full z-10">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between mb-6 text-xs text-zinc-400">
            <Link
              href="/series"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Kembali ke Katalog Drama & Serial</span>
            </Link>

            <span className="inline-flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-[11px] font-medium text-zinc-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Serial Pilihan
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Poster Card */}
            <div className="w-48 sm:w-60 flex-shrink-0 rounded-xl overflow-hidden border border-zinc-800 shadow-xl relative aspect-[2/3] bg-zinc-900">
              <Image
                src={posterSrc}
                alt={series.title}
                fill
                priority
                sizes="(max-width: 640px) 192px, 240px"
                className="object-cover"
              />
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 border border-zinc-800 text-[11px] font-medium text-zinc-300 tracking-wider">
                {totalSeasons} Musim
              </div>
            </div>

            {/* Info Konten Series */}
            <div className="space-y-4 max-w-3xl">
              {/* Meta Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                {rating !== 'N/A' && (
                  <span className="px-2.5 py-1 rounded-md bg-zinc-900 text-amber-400 font-semibold flex items-center gap-1 border border-zinc-800">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{rating}</span>
                  </span>
                )}
                {year && (
                  <span className="px-2.5 py-1 rounded-md bg-zinc-900 text-zinc-300 font-medium border border-zinc-800">
                    {year}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-md bg-zinc-900 text-zinc-300 font-medium border border-zinc-800">
                  {episodes.length > 0 ? `${episodes.length} Episode` : `${totalSeasons} Musim`}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-zinc-900 text-zinc-400 font-medium border border-zinc-800">
                  Serial Drama & TV
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                {series.title}
              </h1>

              {/* Genres */}
              {genres.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {genres.map((g: any, i: number) => {
                    const name = typeof g === 'string' ? g : g.name;
                    return (
                      <span
                        key={i}
                        className="text-xs px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 font-normal"
                      >
                        {name}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <Link
                  href={playFirstHref}
                  className="btn-primary text-sm px-6 py-3"
                  aria-label={`Mulai nonton episode pertama ${series.title}`}
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Putar Episode 1</span>
                </Link>

                <button
                  type="button"
                  className="btn-secondary text-sm px-5 py-3"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Daftar Tontonan</span>
                </button>

                <button
                  type="button"
                  className="p-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                  aria-label="Bagikan serial ini"
                  title="Bagikan"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Synopsis */}
              <div className="pt-4 border-t border-zinc-800/80">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Sinopsis Serial
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed font-light">
                  {series.overview || 'Sinopsis resmi belum tersedia untuk judul serial ini.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Stream Preloader */}
      <StreamPreloader slug={params.slug} type="series" season={1} episode={1} id={firstEpId} />

      {/* Section: Daftar Musim & Episode */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="border-b border-zinc-800 pb-5 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-1 h-5 bg-[#e50914] rounded-full" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>Daftar Episode</span>
              <span className="text-xs font-medium text-zinc-400 bg-zinc-900 px-2.5 py-0.5 rounded border border-zinc-800">
                Musim {currentSeason}
              </span>
            </h2>
          </div>

          {/* Season Selector Tabs */}
          {totalSeasons > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {Array.from({ length: totalSeasons }).map((_, i) => {
                const sNum = i + 1;
                const isActive = currentSeason === sNum;
                return (
                  <Link
                    key={sNum}
                    href={`/series/${params.slug}?season=${sNum}`}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
                      isActive
                        ? 'bg-[#e50914] border-[#e50914] text-white'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    Musim {sNum}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Episode Cards Grid */}
        {episodes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {episodes.map((ep: any) => {
              const stillSrc = ep.stillPath || backdropSrc || '/placeholder-backdrop.png';
              const epHref = `/watch/series/${params.slug}?season=${currentSeason}&episode=${ep.episodeNumber}${ep.id ? `&id=${ep.id}` : ''}`;
              return (
                <Link
                  key={ep.id || ep.episodeNumber}
                  href={epHref}
                  className="group rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-200 flex flex-col"
                >
                  {/* 16:9 Thumbnail Container */}
                  <div className="aspect-video relative overflow-hidden bg-zinc-950">
                    <Image
                      src={stillSrc}
                      alt={ep.name || `Episode ${ep.episodeNumber}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Episode Number Pill */}
                    <div className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded bg-black/80 border border-zinc-800 text-xs font-medium text-zinc-200">
                      EP {ep.episodeNumber}
                    </div>

                    {/* Play Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                        <Play className="w-4 h-4 fill-black ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="p-3.5 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="font-semibold text-sm text-white group-hover:text-zinc-200 transition-colors line-clamp-1">
                        {ep.name || `Episode ${ep.episodeNumber}`}
                      </h4>
                      {ep.overview && (
                        <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed font-light">
                          {ep.overview}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-zinc-400 mt-3 pt-2.5 border-t border-zinc-800/80 font-normal">
                      <span>Musim {currentSeason}</span>
                      <span className="text-[#e50914] font-medium flex items-center gap-1 group-hover:underline">
                        <Play className="w-3 h-3 fill-current" /> Tonton
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-xl bg-zinc-900 border border-zinc-800 text-center text-zinc-400 text-sm">
            <p>Daftar episode belum tersedia atau sedang dalam proses sinkronisasi.</p>
          </div>
        )}
      </div>

      {/* Rekomendasi Serial Serupa */}
      {related.length > 0 && (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <SectionRow
            title="Serial Drama Rekomendasi"
            badge="SERUPA"
            items={related}
            viewAllHref="/series"
          />
        </div>
      )}
    </div>
  );
}
