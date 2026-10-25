import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMovieDetail, getRelated } from '@/lib/idlix';
import { Play, Bookmark, Star, Clock, Calendar, ArrowLeft, Share2, Sparkles, Film } from 'lucide-react';
import SectionRow from '@/components/home/SectionRow';
import StreamPreloader from '@/components/player/StreamPreloader';
import { formatRating, formatRuntime, formatYear } from '@/lib/utils';
import type { MediaItem } from '@/lib/types';

interface MovieDetailPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 60; // Cache 1 menit

export async function generateMetadata({
  params,
}: MovieDetailPageProps): Promise<Metadata> {
  try {
    const movie = await getMovieDetail(params.slug);
    if (!movie) {
      return { title: 'Film Tidak Ditemukan | RANZZ STREAM' };
    }
    const posterUrl = movie.posterPath
      ? `https://image.tmdb.org/t/p/w780${movie.posterPath}`
      : undefined;

    return {
      title: `${movie.title} (${formatYear(movie.releaseDate)}) - Nonton Online Sub Indo`,
      description:
        movie.overview ||
        `Saksikan film ${movie.title} kualitas Full HD & 4K di RANZZ STREAM.`,
      openGraph: {
        title: `${movie.title} | RANZZ STREAM`,
        description: movie.overview,
        images: posterUrl ? [{ url: posterUrl }] : [],
      },
    };
  } catch {
    return { title: 'Nonton Film | RANZZ STREAM' };
  }
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  let movie: any = null;
  let related: MediaItem[] = [];

  try {
    const [movieData, relatedData] = await Promise.allSettled([
      getMovieDetail(params.slug),
      getRelated(params.slug, 'movie'),
    ]);

    if (movieData.status === 'fulfilled' && movieData.value) {
      movie = movieData.value;
    }
    if (relatedData.status === 'fulfilled' && Array.isArray(relatedData.value)) {
      related = relatedData.value;
    }
  } catch (err) {
    console.error('Error loading movie detail:', err);
  }

  if (!movie || !movie.title) {
    notFound();
  }

  const rating = formatRating(movie.voteAverage);
  const year = formatYear(movie.releaseDate);
  const runtime = formatRuntime(movie.runtime);
  const backdropSrc = movie.backdropPath || movie.posterPath;
  const posterSrc = movie.posterPath || '/placeholder-poster.png';

  const genres = Array.isArray(movie.genres)
    ? movie.genres
    : movie.genres
    ? [movie.genres]
    : [];

  const watchHref = `/watch/movie/${movie.slug}?id=${movie.id}`;

  return (
    <div className="min-h-screen pb-20 bg-[#09090b]">
      {/* Background Hero Layer */}
      <div className="relative w-full min-h-[500px] lg:min-h-[580px] flex items-end">
        {backdropSrc && (
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <Image
              src={backdropSrc}
              alt={movie.title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-top opacity-30 filter blur-[1px] scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/70 to-transparent" />
          </div>
        )}

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 w-full z-10">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between mb-6 text-xs text-zinc-400">
            <Link
              href="/movies"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="font-medium">Kembali ke Katalog Film</span>
            </Link>

            <span className="inline-flex items-center gap-1.5 bg-zinc-800/80 border border-zinc-700/60 px-3 py-1 rounded-md text-[11px] font-medium text-zinc-300">
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              Film Pilihan
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Poster Card */}
            <div className="w-52 sm:w-60 flex-shrink-0 rounded-xl overflow-hidden border border-zinc-800 shadow-lg relative aspect-[2/3] bg-zinc-950">
              <Image
                src={posterSrc}
                alt={movie.title}
                fill
                priority
                sizes="(max-width: 640px) 208px, 240px"
                className="object-cover"
              />
              {movie.quality && (
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/75 border border-white/10 text-[10px] font-semibold text-zinc-200 uppercase tracking-wider">
                  {movie.quality}
                </div>
              )}
            </div>

            {/* Info Konten Film */}
            <div className="space-y-4 max-w-3xl">
              {/* Meta Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-zinc-300">
                {rating !== 'N/A' && (
                  <span className="px-2 py-0.5 rounded bg-zinc-800/90 text-amber-400 font-semibold flex items-center gap-1 border border-zinc-700/60">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{rating}</span>
                  </span>
                )}
                {year && (
                  <span className="px-2 py-0.5 rounded bg-zinc-800/90 font-medium border border-zinc-700/60">
                    {year}
                  </span>
                )}
                {runtime && (
                  <span className="px-2 py-0.5 rounded bg-zinc-800/90 text-zinc-400 font-medium border border-zinc-700/60 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    <span>{runtime}</span>
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-zinc-800/90 font-medium border border-zinc-700/60">
                  {movie.quality || 'HD'}
                </span>
                <span className="px-2 py-0.5 rounded bg-zinc-800/90 text-zinc-400 font-medium border border-zinc-700/60 uppercase">
                  Film Layar Lebar
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {movie.title}
              </h1>

              {/* Genres */}
              {genres.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {genres.map((g: any, i: number) => {
                    const name = typeof g === 'string' ? g : g.name;
                    return (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-md bg-zinc-800/70 border border-zinc-700/60 text-zinc-300 font-medium"
                      >
                        {name}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href={watchHref}
                  className="btn-primary text-sm px-6 py-2.5 rounded-lg"
                  aria-label={`Mulai nonton film ${movie.title}`}
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Mulai Nonton</span>
                </Link>

                <button
                  type="button"
                  className="btn-secondary text-sm px-5 py-2.5 rounded-lg"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Daftar Tontonan</span>
                </button>

                <button
                  type="button"
                  className="p-2.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700/60 transition-colors"
                  aria-label="Bagikan film ini"
                  title="Bagikan"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Sinopsis Cerita */}
              <div className="pt-3 space-y-1.5 max-w-2xl border-t border-zinc-800/60">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Sinopsis
                </h3>
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                  {movie.overview || 'Sinopsis resmi belum tersedia untuk judul film ini.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Stream Preloader */}
      <StreamPreloader slug={params.slug} type="movie" id={movie.id} />

      {/* Rekomendasi Film Serupa */}
      {related.length > 0 && (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <SectionRow
            title="Film Serupa Rekomendasi"
            badge="SERUPA"
            items={related}
            viewAllHref="/movies"
          />
        </div>
      )}
    </div>
  );
}
