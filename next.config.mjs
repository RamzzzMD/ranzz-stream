/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Poster/backdrop berasal dari path TMDB; loader kustom memilih ukuran TMDB
    // terdekat sehingga tidak membebani Image Optimization di Vercel.
    loader: 'custom',
    loaderFile: './lib/tmdb-loader.ts',
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
};

export default nextConfig;
