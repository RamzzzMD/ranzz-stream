import { NextRequest } from 'next/server';
import { getCollections, getCollectionDetail } from '@/lib/idlix';
import { handleScraperCall } from '@/lib/api-handler';

export const revalidate = 600;

export async function GET(request: NextRequest) {
  const cursor = request.nextUrl.searchParams.get('cursor') || '';
  const slug = request.nextUrl.searchParams.get('slug') || '';

  if (slug) {
    return handleScraperCall(async () => {
      return await getCollectionDetail(slug);
    });
  }

  return handleScraperCall(async () => {
    return await getCollections(cursor);
  });
}
