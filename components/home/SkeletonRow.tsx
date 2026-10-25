'use client';

import React from 'react';

export default function SkeletonRow({ count = 6 }: { count?: number }) {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-5 bg-zinc-700 rounded-full animate-pulse" />
        <div className="w-48 h-5 bg-zinc-800 rounded animate-pulse" />
      </div>
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="w-36 sm:w-44 md:w-48 flex-shrink-0 flex flex-col space-y-2">
            <div className="aspect-[2/3] w-full rounded-xl bg-zinc-800/80 border border-zinc-800 animate-pulse" />
            <div className="w-3/4 h-3.5 bg-zinc-800 rounded animate-pulse" />
            <div className="w-1/2 h-3 bg-zinc-800/60 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
