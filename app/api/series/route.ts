import { NextRequest } from 'next/server';
import { getSeries } from '@/lib/idlix';
import { handleScraperCall } from '@/lib/api-handler';

export const revalidate = 300;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sort = searchParams.get('sort') || 'latest';
  const page = searchParams.get('page') || '1';
  const genre = searchParams.get('genre') || '';
  const country = searchParams.get('country') || '';
  const year = searchParams.get('year') || '';

  const params: Record<string, string> = { sort, page };
  if (genre) params.genre = genre;
  if (country) params.country = country;
  if (year) params.year = year;

  return handleScraperCall(async () => {
    return await getSeries(params);
  });
}
