import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subUrl = searchParams.get('url');

    if (!subUrl) {
      return new NextResponse('Missing url parameter', { status: 400 });
    }

    const response = await fetch(subUrl, {
      headers: {
        'User-Agent': 'IDLIX-Android/0.1.39',
      },
    });

    if (!response.ok) {
      return new NextResponse('Failed to fetch subtitle', { status: response.status });
    }

    const text = await response.text();

    return new NextResponse(text, {
      status: 200,
      headers: {
        'Content-Type': 'text/vtt; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (error: any) {
    console.error('Subtitle Proxy Error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
