import { NextRequest } from 'next/server';
import { search } from '@/lib/idlix';
import { handleScraperCall } from '@/lib/api-handler';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || '';
  if (!q.trim()) {
    return handleScraperCall(async () => []);
  }

  return handleScraperCall(async () => {
    return await search(q.trim());
  }, []);
}
