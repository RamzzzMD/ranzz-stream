import { NextRequest, NextResponse } from 'next/server';
import { getStream, getMovieDetail, getSeriesDetail, getSeasonEpisodes } from '@/lib/idlix';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface CacheEntry {
  data: any;
  expiresAtMs: number;
}

// Global in-memory cache across requests to make stream playback instant
const streamCache = new Map<string, CacheEntry>();

async function handleStream(target: any, options: any) {
  const isUuid = (val: string) =>
    typeof val === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

  const { contentType, contentId, season = 1, episode = 1 } = options;
  const isSeries = contentType === 'series' || contentType === 'tv_series' || contentType === 'episode';
  const cacheKey = `${isSeries ? 'episode' : 'movie'}:${contentId || target}:${season}:${episode}`;

  // Check cache first
  const cached = streamCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAtMs) {
    return cached.data;
  }

  let stream: any = null;

  // 1. If it's a series or episode (Note: idlixku API ONLY accepts 'episode' or 'movie' for play-info)
  if (isSeries) {
    const candidateEpId = isUuid(contentId) ? contentId : isUuid(target) ? target : null;

    // A. If an episode ID was directly passed (e.g. from clicking an episode in the list)
    if (candidateEpId) {
      try {
        stream = await getStream(candidateEpId, {
          contentType: 'episode',
          contentId: candidateEpId,
        });
      } catch (err: any) {
        // candidateEpId might have been a series UUID, continue to resolve episode
        console.warn('Candidate episode ID play-info failed, resolving via season:', err?.message);
      }
    }

    // B. Resolve series -> season -> target episode
    if (!stream) {
      let seriesDetail: any = null;
      try {
        seriesDetail = await getSeriesDetail(target || contentId);
      } catch (e) {}

      const seriesIdentifier = seriesDetail?.slug || seriesDetail?.id || target || contentId;
      const seasonInfo = await getSeasonEpisodes(seriesIdentifier, season);
      const allEpisodes: any[] = seasonInfo?.season?.episodes || [];
      const targetEp =
        allEpisodes.find(
          (e) => (contentId && e.id === contentId) || e.episodeNumber === episode
        ) || allEpisodes[0];

      if (targetEp) {
        stream = await getStream(targetEp.id, {
          contentType: 'episode',
          contentId: targetEp.id,
        });
      } else {
        // Fallback search
        stream = await getStream(target, {
          contentType: 'series',
          season,
          episode,
        });
      }
    }
  } else {
    // 2. Movie resolution
    const movieUuid = isUuid(contentId) ? contentId : isUuid(target) ? target : null;
    if (movieUuid) {
      stream = await getStream(movieUuid, { contentType: 'movie', contentId: movieUuid });
    } else {
      let detail: any = null;
      try {
        detail = await getMovieDetail(target);
      } catch (e) {}

      if (detail && detail.id) {
        stream = await getStream(detail.id, { contentType: 'movie', contentId: detail.id });
      } else {
        // If movie not found, check if it was actually a series
        let sDetail: any = null;
        try {
          sDetail = await getSeriesDetail(target);
        } catch (e) {}

        if (sDetail) {
          const seasonInfo = await getSeasonEpisodes(sDetail.slug || sDetail.id, season);
          const allEpisodes: any[] = seasonInfo?.season?.episodes || [];
          const targetEp = allEpisodes.find((e) => e.episodeNumber === episode) || allEpisodes[0];
          if (targetEp) {
            stream = await getStream(targetEp.id, {
              contentType: 'episode',
              contentId: targetEp.id,
            });
          }
        }

        if (!stream) {
          stream = await getStream(target, options);
        }
      }
    }
  }

  // Rewrite subtitles to local same-origin proxy to guarantee 100% CORS and VTT rendering
  if (stream?.subtitles && Array.isArray(stream.subtitles)) {
    stream.subtitles = stream.subtitles.map((sub: any) => ({
      lang: sub.lang,
      label: sub.label || (sub.lang === 'id' ? 'Indonesia' : sub.lang),
      url: `/api/subtitles?url=${encodeURIComponent(sub.url)}`,
      rawUrl: sub.url,
    }));
  }

  // Cache result for 15 minutes or until token expires
  if (stream && stream.masterManifest) {
    const ttlMs = stream.expiresAt
      ? Math.max(60000, stream.expiresAt * 1000 - Date.now() - 60000)
      : 15 * 60 * 1000;
    streamCache.set(cacheKey, {
      data: stream,
      expiresAtMs: Date.now() + ttlMs,
    });
    if (contentId && contentId !== target) {
      streamCache.set(`${contentType}:${contentId}:${season}:${episode}`, {
        data: stream,
        expiresAtMs: Date.now() + ttlMs,
      });
    }
  }

  return stream;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const target = searchParams.get('target') || searchParams.get('slug') || '';
    const contentType = searchParams.get('contentType') || searchParams.get('type') || 'movie';
    const contentId = searchParams.get('contentId') || searchParams.get('id') || undefined;
    const season = searchParams.get('season') ? parseInt(searchParams.get('season')!, 10) : 1;
    const episode = searchParams.get('episode') ? parseInt(searchParams.get('episode')!, 10) : 1;

    if (!target && !contentId) {
      return NextResponse.json(
        { ok: false, error: 'Parameter target atau contentId diperlukan' },
        { status: 400 }
      );
    }

    const stream = await handleStream(target, { contentType, contentId, season, episode });
    return NextResponse.json({ ok: true, data: stream });
  } catch (err: any) {
    console.error('[WATCH STREAM API ERROR]:', err);
    return NextResponse.json(
      { ok: false, error: err?.message || 'Gagal memproses stream video' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { target, contentType, contentId, season, episode } = body;

    if (!target && !contentId) {
      return NextResponse.json(
        { ok: false, error: 'Parameter target atau contentId diperlukan' },
        { status: 400 }
      );
    }

    const stream = await handleStream(target, {
      contentType,
      contentId,
      season: season ? parseInt(season, 10) : 1,
      episode: episode ? parseInt(episode, 10) : 1,
    });

    return NextResponse.json({ ok: true, data: stream });
  } catch (err: any) {
    console.error('[WATCH STREAM API ERROR]:', err);
    return NextResponse.json(
      { ok: false, error: err?.message || 'Gagal memproses stream video' },
      { status: 500 }
    );
  }
}

