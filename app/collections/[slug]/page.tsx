import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCollectionDetail } from '@/lib/idlix';
import CardPoster from '@/components/home/CardPoster';
import { ArrowLeft } from 'lucide-react';
import type { MediaItem } from '@/lib/types';

interface CollectionDetailPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 600;

export async function generateMetadata({
  params,
}: CollectionDetailPageProps): Promise<Metadata> {
  try {
    const res = await getCollectionDetail(params.slug);
    const col = res?.collection;
    if (!col) return { title: 'Koleksi | RANZZ STREAM' };
    return {
      title: `${col.title} - Koleksi Film | RANZZ STREAM`,
      description: col.description || `Daftar film saga ${col.title} di RANZZ STREAM.`,
    };
  } catch {
    return { title: 'Koleksi Film | RANZZ STREAM' };
  }
}

export default async function CollectionDetailPage({
  params,
}: CollectionDetailPageProps) {
  let detail: any = null;

  try {
    detail = await getCollectionDetail(params.slug);
  } catch (err) {
    console.error('Error loading collection detail:', err);
  }

  if (!detail || !detail.collection) {
    notFound();
  }

  const { collection, sections = [] } = detail;
  const bgSrc = collection.backdropPath || collection.posterPath;

  return (
    <div className="min-h-screen pt-8 pb-16">
      {/* Header Koleksi */}
      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <Link
          href="/collections"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Koleksi</span>
        </Link>

        <div className="relative rounded-xl overflow-hidden border border-zinc-800 p-8 sm:p-10 bg-zinc-900 shadow-lg">
          {bgSrc && (
            <div className="absolute inset-0 -z-10">
              <Image
                src={bgSrc}
                alt={collection.title}
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-15 filter blur-[0.5px]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/85 to-transparent" />
            </div>
          )}

          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-medium uppercase inline-block">
              {collection.kind || 'Franchise Saga'}
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              {collection.title}
            </h1>
            {collection.description && (
              <p className="text-sm text-zinc-300 leading-relaxed font-light">
                {collection.description}
              </p>
            )}
            <p className="text-xs font-medium text-zinc-400 pt-1">
              Total {collection.itemCount || 0} Karya Sinematik
            </p>
          </div>
        </div>
      </div>

      {/* Bagian Per Seksi Koleksi */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {sections.map((sec: any) => {
          const items: MediaItem[] = sec.items || [];
          return (
            <div key={sec.id || sec.title}>
              <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#e50914] rounded-full inline-block" />
                <span>{sec.title}</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {items.map((item, idx) => (
                  <CardPoster key={item.id || idx} item={item} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
