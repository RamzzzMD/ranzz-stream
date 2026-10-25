import { NextResponse } from 'next/server';

// ─── SAFE API HANDLER WRAPPER ───
// Membungkus scraper call dengan standard JSON response & graceful fallback

export async function handleScraperCall<T>(
  action: () => Promise<T>,
  fallback?: T,
  cacheSeconds = 300
) {
  try {
    const data = await action();
    return NextResponse.json(
      { ok: true, data },
      {
        status: 200,
        headers: {
          'Cache-Control': `public, s-maxage=${cacheSeconds}, stale-while-revalidate=${cacheSeconds * 2}`,
        },
      }
    );
  } catch (err: any) {
    console.error('[SCRAPER API ERROR]:', err?.message || err);
    if (fallback !== undefined) {
      return NextResponse.json(
        { ok: true, data: fallback, fallback: true, warning: err?.message },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { ok: false, error: err?.message || 'Gagal memproses data dari scraper' },
      { status: 500 }
    );
  }
}
