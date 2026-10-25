import { NextResponse } from 'next/server';
import { getHome } from '@/lib/idlix';
import { handleScraperCall } from '@/lib/api-handler';
import { FALLBACK_HOME } from '@/lib/fallback-data';

export const revalidate = 300; // Cache 5 menit

export async function GET() {
  return handleScraperCall(async () => {
    const data = await getHome();
    return data;
  }, FALLBACK_HOME);
}
