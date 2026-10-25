import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getCollections } from '@/lib/idlix';
import { Layers, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Koleksi & Waralaba Film | RANZZ STREAM',
  description:
    'Jelajahi kumpulan saga sinematik, waralaba Marvel, Star Wars, Harry Potter, dan semesta film lainnya di RANZZ STREAM.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 600;

interface CollectionsPageProps {
  searchParams: {
    cursor?: string;
  };
}

export default async function CollectionsPage({ searchParams }: CollectionsPageProps) {
  let collections: any[] = [];
  let nextCursor: string | null = null;
  let total = 0;

  try {
    const res = await getCollections(searchParams.cursor || '');
    if (res?.collections) {
      collections = res.collections;
      nextCursor = res.nextCursor || null;
      total = res.total || collections.length;
    }
  } catch (err) {
    console.error('Error loading collections:', err);
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 w-full min-h-screen">
      <div className="border-b border-zinc-800 pb-6 mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
          <span className="w-1 h-4 bg-[#e50914] rounded-full inline-block" />
          <Layers className="w-3.5 h-3.5 text-zinc-400" />
          <span>Cinematic Universes</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Waralaba & Semesta Film
        </h1>
        <p className="text-sm text-zinc-400 mt-1 font-light">
          Koleksi saga lengkap terurut sesuai lini masa sinematik dan tanggal rilis bioskop.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {collections.map((col) => {
          const bgSrc = col.backdropPath || col.posterPath || '/placeholder-backdrop.png';
          return (
            <Link
              key={col.id || col.slug}
              href={`/collections/${col.slug}`}
              className="group relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 hover:border-zinc-700 transition-all duration-200 flex flex-col justify-end min-h-[220px] p-6"
            >
              <div className="absolute inset-0 -z-10">
                <Image
                  src={bgSrc}
                  alt={col.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent" />
              </div>

              <div className="space-y-1.5 z-10">
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                  <span className="uppercase text-[11px]">{col.kind || 'Franchise'}</span>
                  <span>•</span>
                  <span>{col.itemCount || 0} Judul</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-zinc-200 transition-colors">
                  {col.title}
                </h3>
                {col.description && (
                  <p className="text-xs text-zinc-400 line-clamp-2 font-light">
                    {col.description}
                  </p>
                )}
                <div className="pt-2 flex items-center text-xs font-medium text-[#e50914] group-hover:underline">
                  <span>Lihat Seluruh Koleksi</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Pagination Next Cursor */}
      {nextCursor && (
        <div className="mt-12 text-center">
          <Link
            href={`/collections?cursor=${encodeURIComponent(nextCursor)}`}
            className="btn-primary text-xs py-2.5 px-6 rounded-lg inline-block"
          >
            Muat Koleksi Berikutnya
          </Link>
        </div>
      )}
    </div>
  );
}
