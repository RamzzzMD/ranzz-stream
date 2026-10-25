import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getMovieDetail, getSeriesDetail, getSeasonEpisodes } from '@/lib/idlix';
import WatchClient from '@/components/player/WatchClient';
import { ArrowLeft } from 'lucide-react';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface WatchPageProps {
  params: {
    slug: string[]; // e.g. ['movie', 'avatar-2009'] or ['series', 'doctor-x-2026'] or ['black-clover-2017']
  };
  searchParams: {
    season?: string;
    episode?: string;
    id?: string;
  };
}

export async function generateMetadata({
  params,
  searchParams,
}: WatchPageProps): Promise<Metadata> {
  const parts = params.slug || [];
  const rawType = parts.length > 1 ? parts[0] : 'stream';
  const slugOrId = parts.length > 1 ? parts[1] : parts[0] || '';
  const sNum = searchParams.season || '1';
  const eNum = searchParams.episode || '1';

  let title = 'Streaming | RANZZ STREAM';
  if (rawType === 'series') {
    title = `Streaming ${slugOrId} S${sNum}E${eNum} | RANZZ STREAM`;
  } else if (rawType === 'movie') {
    title = `Streaming ${slugOrId} | RANZZ STREAM`;
  }

  return {
    title,
    description: `Nonton online kualitas terbaik di RANZZ STREAM.`,
  };
}

export default async function WatchPage({ params, searchParams }: WatchPageProps) {
  const parts = params.slug || [];
  let detectedType = parts.length > 1 ? parts[0] : 'unknown';
  const slugOrId = parts.length > 1 ? parts[1] : parts[0] || '';
  const season = searchParams.season ? parseInt(searchParams.season, 10) : 1;
  const episode = searchParams.episode ? parseInt(searchParams.episode, 10) : 1;
  const providedId = searchParams.id;

  let mediaTitle = slugOrId.replace(/[-_]/g, ' ').toUpperCase();
  let resolvedType = detectedType === 'series' ? 'series' : 'movie';
  let nextEpisodeHref: string | undefined;
  let nextEpisodeTitle: string | undefined;

  // ─── AMBIL METADATA JUDUL UNTUK TAMPILAN INSTAN ───
  try {
    if (detectedType === 'series' || detectedType === 'unknown') {
      const sDetail = await getSeriesDetail(slugOrId).catch(() => null);
      if (sDetail && sDetail.title) {
        resolvedType = 'series';
        mediaTitle = `${sDetail.title} (S${season}E${episode})`;

        try {
          const seasonData = await getSeasonEpisodes(sDetail.slug || slugOrId, season);
          const allEps: any[] = seasonData?.season?.episodes || [];
          const curIdx = allEps.findIndex((e) => e.episodeNumber === episode);
          if (curIdx !== -1 && curIdx < allEps.length - 1) {
            const nextEp = allEps[curIdx + 1];
            nextEpisodeHref = `/watch/series/${slugOrId}?season=${season}&episode=${nextEp.episodeNumber}&id=${nextEp.id}`;
            nextEpisodeTitle = nextEp.name || `Episode ${nextEp.episodeNumber}`;
          }
        } catch (e) {}
      }
    }

    if (resolvedType !== 'series') {
      const mDetail = await getMovieDetail(slugOrId).catch(() => null);
      if (mDetail && mDetail.title) {
        resolvedType = 'movie';
        mediaTitle = mDetail.title;
      }
    }
  } catch (e) {
    // Abaikan kegagalan metadata agar halaman tetap render
  }

  const backHref = resolvedType === 'series' ? `/series/${slugOrId}` : `/movie/${slugOrId}`;

  return (
    <div className="min-h-screen pt-20 pb-16 bg-[#09090b]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Status */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Halaman Detail</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-light">Server Online</span>
          </div>
        </div>

        {/* Client Watch Component */}
        <WatchClient
          slug={slugOrId}
          type={resolvedType}
          season={season}
          episode={episode}
          contentId={providedId}
          initialMediaTitle={mediaTitle}
          nextEpisodeHref={nextEpisodeHref}
          nextEpisodeTitle={nextEpisodeTitle}
        />
      </div>
    </div>
  );
}
