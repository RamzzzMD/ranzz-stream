import { spawn } from 'node:child_process';
import { createWriteStream, existsSync } from 'node:fs';

const BASE_URL = process.env.IDLIX_API_URL || 'https://api.idlixku.com/api';
const ORIGIN_URL = process.env.IDLIX_ORIGIN || 'https://z2.idlixku.com';
const USER_AGENT = process.env.IDLIX_USER_AGENT || 'IDLIX-Android/0.1.39';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const parseCookieHeader = (header) => {
  if (!header) return '';
  const match = header.match(/did=[^;]+/i);
  return match ? match[0] : '';
};

const request = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const headers = {
    'User-Agent': USER_AGENT,
    Accept: 'application/json',
    ...(options.headers || {})
  };
  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body
    });
    const cookieHeader = response.headers.get('set-cookie');
    const didCookie = parseCookieHeader(cookieHeader);

    if (!response.ok) {
      console.warn(`[IDLIX SCRAPER] ${url} returned HTTP ${response.status}`);
    }

    const text = await response.text().catch(() => '');
    let data = null;
    try {
      data = JSON.parse(text);
    } catch {
      if (text.includes('<!DOCTYPE html>') || text.includes('cloudflare') || text.includes('Just a moment')) {
        console.error(`[IDLIX SCRAPER CLOUDFLARE BLOCK] Detected Cloudflare challenge / HTML from ${url}`);
      }
    }
    return { status: response.status, data, didCookie, response };
  } catch (err) {
    console.error(`[IDLIX SCRAPER NETWORK ERROR] Failed to fetch ${url}:`, err?.message || err);
    return { status: 500, data: null, didCookie: '', response: null };
  }
};

export const getHome = async () => {
  const { data } = await request('/homepage');
  return data;
};

export const getTrending = async () => {
  const { data } = await request('/search/trending');
  return data;
};

export const getPopular = async (type = 'all', page = 1) => {
  if (type === 'movie' || type === 'movies') {
    const { data } = await request(`/movies?sort=popularity&page=${page}`);
    return data;
  }
  if (type === 'series' || type === 'tv') {
    const { data } = await request(`/series?sort=popularity&page=${page}`);
    return data;
  }
  const [moviesRes, seriesRes] = await Promise.all([
    request(`/movies?sort=popularity&page=${page}`),
    request(`/series?sort=popularity&page=${page}`)
  ]);
  return {
    movies: moviesRes.data?.data || [],
    series: seriesRes.data?.data || []
  };
};

export const getLatestMovies = async (page = 1) => {
  const { data } = await request(`/movies?sort=latest&page=${page}`);
  return data;
};

export const getLatestSeries = async (page = 1) => {
  const { data } = await request(`/series?sort=latest&page=${page}`);
  return data;
};

export const getMovies = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const { data } = await request(`/movies${query ? `?${query}` : ''}`);
  return data;
};

export const getSeries = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const { data } = await request(`/series${query ? `?${query}` : ''}`);
  return data;
};

export const getMovieFilterOptions = async () => {
  const { data } = await request('/movies/filter-options');
  return data;
};

export const getSeriesFilterOptions = async () => {
  const { data } = await request('/series/filter-options');
  return data;
};

export const getCollections = async (cursor = '') => {
  const { data } = await request(`/collections/page${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`);
  return data;
};

export const getCollectionDetail = async (slug) => {
  const { data } = await request(`/homepage/collection/${encodeURIComponent(slug)}`);
  return data;
};

export const getNetworkDetail = async (slug) => {
  const { data } = await request(`/homepage/network/${encodeURIComponent(slug)}`);
  return data;
};

export const getCountries = async () => {
  const { data } = await request('/browse/countries');
  return data?.data || [];
};

export const getYears = async () => {
  const { data } = await request('/browse/years');
  return data?.data || [];
};

export const search = async (query) => {
  const { data } = await request(`/search?q=${encodeURIComponent(query)}`);
  return data?.results || [];
};

export const getMovieDetail = async (slugOrId) => {
  const { data } = await request(`/movies/${encodeURIComponent(slugOrId)}`);
  return data;
};

export const getSeriesDetail = async (slugOrId) => {
  const { data } = await request(`/series/${encodeURIComponent(slugOrId)}`);
  return data;
};

export const getSeasonEpisodes = async (seriesSlugOrId, seasonNumber = 1) => {
  const { data } = await request(`/series/${encodeURIComponent(seriesSlugOrId)}/season/${seasonNumber}`);
  return data;
};

export const getRelated = async (slugOrId, type = 'movie') => {
  const prefix = type === 'series' || type === 'tv' ? 'series' : 'movies';
  const { data } = await request(`/${prefix}/${encodeURIComponent(slugOrId)}/related`);
  return data?.data || [];
};

export const parseTargetQuery = (query) => {
  let cleanQuery = query;
  let season = null;
  let episode = null;

  const sEpRegex = /(?:s|season\s*)(\d+)\s*(?:e|ep|eps|episode\s*)(\d+)/i;
  const matchSEp = cleanQuery.match(sEpRegex);
  if (matchSEp) {
    season = parseInt(matchSEp[1], 10);
    episode = parseInt(matchSEp[2], 10);
    cleanQuery = cleanQuery.replace(matchSEp[0], '').trim();
    return { title: cleanQuery, season, episode };
  }

  const epOnlyRegex = /(?:ep|eps|episode)\s*(\d+)/i;
  const matchEp = cleanQuery.match(epOnlyRegex);
  if (matchEp) {
    episode = parseInt(matchEp[1], 10);
    season = 1;
    cleanQuery = cleanQuery.replace(matchEp[0], '').trim();
    return { title: cleanQuery, season, episode };
  }

  return { title: cleanQuery, season: null, episode: null };
};

export const getStream = async (target, options = {}) => {
  let contentType = options.contentType;
  let contentId = options.contentId;
  let title = '';
  let seasonNumber = options.season;
  let episodeNumber = options.episode;

  if (!contentType || !contentId) {
    if (typeof target === 'object' && target !== null) {
      if (target.episodeNumber || target.seasonId) {
        contentType = 'episode';
        contentId = target.id;
        title = target.name || target.title || '';
      } else {
        contentType = target.contentType === 'tv_series' ? 'series' : (target.contentType || 'movie');
        contentId = target.id;
        title = target.title || '';
      }
    } else if (typeof target === 'string') {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(target);
      if (isUuid) {
        contentType = contentType || 'movie';
        contentId = target;
      } else {
        const parsed = parseTargetQuery(target);
        const searchQuery = parsed.title || target;
        if (parsed.season && !seasonNumber) seasonNumber = parsed.season;
        if (parsed.episode && !episodeNumber) episodeNumber = parsed.episode;

        const results = await search(searchQuery);
        if (!results || results.length === 0) {
          throw new Error(`Target not found for query: ${target}`);
        }
        const first = results[0];
        title = first.title;

        if (first.contentType === 'tv_series') {
          contentType = 'series';
          const seriesDetail = await getSeriesDetail(first.slug || first.id);
          const sNum = seasonNumber || 1;
          const eNum = episodeNumber || 1;
          const seasonData = await getSeasonEpisodes(seriesDetail.slug || seriesDetail.id, sNum);
          const episode = seasonData?.season?.episodes?.find((e) => e.episodeNumber === eNum) || seasonData?.season?.episodes?.[0];
          if (!episode) {
            throw new Error(`Episode ${eNum} not found for season ${sNum}`);
          }
          contentType = 'episode';
          contentId = episode.id;
          title = `${seriesDetail.title} S${String(sNum).padStart(2, '0')}E${String(eNum).padStart(2, '0')} - ${episode.name}`;
        } else {
          contentType = 'movie';
          contentId = first.id;
        }
      }
    }
  }

  const playInfoRes = await request(`/watch/play-info/${contentType}/${contentId}`);
  let playInfo = playInfoRes.data;
  let didCookie = playInfoRes.didCookie;

  if (!playInfo || (!playInfo.gateToken && !playInfo.claim)) {
    throw new Error(`Failed to obtain play info for ${contentType}/${contentId}`);
  }

  let claimData = null;
  if (playInfo.kind === 'gate') {
    const unlockAt = playInfo.unlockAt || 0;
    const serverNow = playInfo.serverNow || Date.now();
    const waitMs = Math.max(0, unlockAt - serverNow) + 500;
    if (waitMs > 0) {
      await sleep(waitMs);
    }

    const claimRes = await request('/watch/session/claim', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: didCookie || ''
      },
      body: JSON.stringify({ gateToken: playInfo.gateToken })
    });

    if (!claimRes.data || !claimRes.data.claim) {
      throw new Error(`Playback gate claim failed: ${JSON.stringify(claimRes.data)}`);
    }
    claimData = claimRes.data;
  } else {
    claimData = playInfo;
  }

  const redeemRes = await fetch(claimData.redeemUrl, {
    method: 'POST',
    headers: {
      'User-Agent': USER_AGENT,
      Origin: ORIGIN_URL,
      Referer: `${ORIGIN_URL}/`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ claim: claimData.claim })
  });

  const streamInfo = await redeemRes.json();
  if (!streamInfo || streamInfo.code !== 'ok') {
    throw new Error(`Failed to redeem stream: ${JSON.stringify(streamInfo)}`);
  }

  const manifestRes = await fetch(streamInfo.url, {
    headers: {
      'User-Agent': USER_AGENT,
      Origin: ORIGIN_URL,
      Referer: `${ORIGIN_URL}/`
    }
  });
  const manifestText = await manifestRes.text();

  const qualities = [];
  const lines = manifestText.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('#EXT-X-STREAM-INF:')) {
      const nameMatch = line.match(/NAME="([^"]+)"/i);
      const bwMatch = line.match(/BANDWIDTH=(\d+)/i);
      const streamUrl = lines[i + 1]?.trim();
      if (streamUrl) {
        const fullStreamUrl = new URL(streamUrl, streamInfo.url).href;
        qualities.push({
          quality: nameMatch ? nameMatch[1] : 'default',
          bandwidth: bwMatch ? parseInt(bwMatch[1], 10) : null,
          url: fullStreamUrl
        });
      }
    }
  }

  return {
    title: title || claimData.title || streamInfo.videoId,
    videoId: streamInfo.videoId,
    masterManifest: streamInfo.url,
    qualities,
    subtitles: (streamInfo.subtitles || []).map((s) => ({
      lang: s.lang,
      label: s.label,
      url: s.path
    })),
    expiresAt: streamInfo.expiresAt,
    ttlSeconds: streamInfo.ttlSeconds
  };
};

export const download = async (urlOrIdOrQuery, options = {}) => {
  const stream = await getStream(urlOrIdOrQuery, options);
  const preferredQuality = options.quality || '720p';
  const selectedStream = stream.qualities.find((q) => q.quality.toLowerCase() === preferredQuality.toLowerCase()) || stream.qualities[stream.qualities.length - 1] || { url: stream.masterManifest };

  const sanitizedTitle = (stream.title || 'video').replace(/[\/\\?%*:|"<>]/g, '_');
  const filename = `${sanitizedTitle}.mp4`;

  if (options.streamOnly) {
    return {
      title: stream.title,
      filename,
      qualities: stream.qualities,
      subtitles: stream.subtitles,
      selectedUrl: selectedStream.url
    };
  }

  const outputPath = options.outputPath || `/tmp/opencode/${filename}`;

  return new Promise((resolve, reject) => {
    const ffmpegArgs = [
      '-y',
      '-headers', `User-Agent: ${USER_AGENT}\r\nOrigin: ${ORIGIN_URL}\r\nReferer: ${ORIGIN_URL}/\r\n`,
      '-i', selectedStream.url,
      '-c', 'copy',
      '-bsf:a', 'aac_adtstoasc'
    ];

    if (options.buffer) {
      ffmpegArgs.push('-f', 'mp4', '-movflags', 'frag_keyframe+empty_moov', 'pipe:1');
      const proc = spawn('ffmpeg', ffmpegArgs);
      const chunks = [];
      proc.stdout.on('data', (c) => chunks.push(c));
      proc.on('close', (code) => {
        if (code === 0) {
          const buffer = Buffer.concat(chunks);
          resolve({
            title: stream.title,
            filename,
            size: buffer.length,
            formattedSize: `${(buffer.length / (1024 * 1024)).toFixed(2)} MB`,
            buffer,
            subtitles: stream.subtitles
          });
        } else {
          reject(new Error(`FFmpeg transcoding failed with code ${code}`));
        }
      });
      proc.on('error', reject);
    } else {
      ffmpegArgs.push(outputPath);
      const proc = spawn('ffmpeg', ffmpegArgs);
      proc.on('close', (code) => {
        if (code === 0) {
          resolve({
            title: stream.title,
            filename,
            outputPath,
            subtitles: stream.subtitles
          });
        } else {
          reject(new Error(`FFmpeg download failed with code ${code}`));
        }
      });
      proc.on('error', reject);
    }
  });
};

export default {
  getHome,
  getTrending,
  getPopular,
  getLatestMovies,
  getLatestSeries,
  getMovies,
  getSeries,
  getMovieFilterOptions,
  getSeriesFilterOptions,
  getCollections,
  getCollectionDetail,
  getNetworkDetail,
  getCountries,
  getYears,
  search,
  getMovieDetail,
  getSeriesDetail,
  getSeasonEpisodes,
  getRelated,
  parseTargetQuery,
  getStream,
  download
};
