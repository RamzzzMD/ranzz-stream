// ─── TMDB IMAGE LOADER ───
// Mengarahkan poster/backdrop ke CDN TMDB dengan inline SVG fallback aman

export default function tmdbLoader({
  src,
  width,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (!src || src.includes('placeholder')) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#120a2a"/>
          <stop offset="100%" stop-color="#0a0118"/>
        </linearGradient>
      </defs>
      <rect width="500" height="750" fill="url(#bg)"/>
      <rect x="20" y="20" width="460" height="710" fill="none" stroke="#ff2e97" stroke-width="2" stroke-opacity="0.3" rx="12"/>
      <text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" fill="#ff2e97" font-family="sans-serif" font-weight="900" font-size="36" letter-spacing="4">RANZZ</text>
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#00f0ff" font-family="sans-serif" font-weight="700" font-size="16" letter-spacing="6">STREAM</text>
    </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // Pilih bucket ukuran TMDB paling optimal
  let size = 'w500';
  if (width <= 185) size = 'w185';
  else if (width <= 342) size = 'w342';
  else if (width <= 500) size = 'w500';
  else if (width <= 780) size = 'w780';
  else if (width <= 1280) size = 'w1280';
  else size = 'original';

  const cleanSrc = src.startsWith('/') ? src : `/${src}`;
  return `https://image.tmdb.org/t/p/${size}${cleanSrc}`;
}
