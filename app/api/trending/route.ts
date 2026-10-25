import { NextResponse } from 'next/server';
import { getTrending } from '@/lib/idlix';
import { handleScraperCall } from '@/lib/api-handler';

export const revalidate = 300;

export async function GET() {
  return handleScraperCall(async () => {
    const data = await getTrending();
    return data;
  });
}
