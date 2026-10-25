import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getNetworkDetail } from '@/lib/idlix';
import CardPoster from '@/components/home/CardPoster';
import { Tv, ArrowLeft } from 'lucide-react';
import type { MediaItem } from '@/lib/types';

interface NetworkPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 600;

export async function generateMetadata({ params }: NetworkPageProps): Promise<Metadata> {
  const name = params.slug.replace(/-/g, ' ').toUpperCase();
  return {
    title: `${name} Originals | RANZZ STREAM`,
    description: `Koleksi serial dan film original dari jaringan ${name} di RANZZ STREAM.`,
  };
}

export default async function NetworkPage({ params }: NetworkPageProps) {
  let items: MediaItem[] = [];
  const networkName = params.slug.replace(/-/g, ' ').toUpperCase();

  try {
    const res = await getNetworkDetail(params.slug);
    if (res?.data && Array.isArray(res.data)) {
      items = res.data;
    }
  } catch (err) {
    console.error('Error fetching network detail:', err);
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 w-full min-h-screen">
      <Link
        href="/series"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Serial</span>
      </Link>

      <div className="border-b border-zinc-800 pb-6 mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
          <span className="w-1 h-4 bg-[#e50914] rounded-full inline-block" />
          <Tv className="w-3.5 h-3.5 text-zinc-400" />
          <span>Network Originals</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {networkName}
        </h1>
        <p className="text-sm text-zinc-400 mt-1 font-light">
          Karya eksklusif dan serial orisinal tayangan {networkName} dengan subtitle Indonesia.
        </p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {items.map((item, idx) => (
            <CardPoster key={item.id || idx} item={item} priority={idx < 6} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-900 rounded-xl border border-zinc-800 p-8 max-w-md mx-auto">
          <p className="text-sm text-zinc-400 font-light">
            Tidak ada judul yang ditemukan untuk jaringan ini saat ini.
          </p>
        </div>
      )}
    </div>
  );
}
