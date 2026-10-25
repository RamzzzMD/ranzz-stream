import { NextRequest } from 'next/server';
import { getMovieFilterOptions, getSeriesFilterOptions } from '@/lib/idlix';
import { handleScraperCall } from '@/lib/api-handler';

export const revalidate = 86400; // Cache 24 jam

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type') || 'movie';

  return handleScraperCall(async () => {
    if (type === 'series' || type === 'tv') {
      return await getSeriesFilterOptions();
    }
    return await getMovieFilterOptions();
  });
}
