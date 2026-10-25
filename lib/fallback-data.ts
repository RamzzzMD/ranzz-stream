// ─── DUMMY DATA FALLBACK ───
// Digunakan saat scraper gagal / offline agar UI tetap tampil memukau

import type { MediaItem, HomeData } from './types';

export const FALLBACK_TRENDING: MediaItem[] = [
  {
    id: 'fb-1',
    title: 'Cyberpunk: Edgerunners',
    slug: 'cyberpunk-edgerunners-2022',
    posterPath: '/7vEOq0fL6fHwW0FpT2K0UqA5lKz.jpg',
    backdropPath: '/sAtoMqDVhNDQBc3QJL3RF6hl7q.jpg',
    contentType: 'tv_series',
    voteAverage: '9.0',
    releaseDate: '2022-09-13',
    quality: 'HD',
    overview: 'Di distopia yang dipenuhi korupsi dan implan sibernetika, seorang pemuda jalanan berjuang menjadi outlaw tentara bayaran edgerunner.',
    genres: [{ id: '1', name: 'Animation', slug: 'animation' }, { id: '2', name: 'Action', slug: 'action' }, { id: '3', name: 'Sci-Fi', slug: 'science-fiction' }],
  },
  {
    id: 'fb-2',
    title: 'Blade Runner 2049',
    slug: 'blade-runner-2049-2017',
    posterPath: '/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
    backdropPath: '/ilRyAZwN5L4mB1gW3Kk0l72y7gH.jpg',
    contentType: 'movie',
    voteAverage: '8.5',
    releaseDate: '2017-10-04',
    quality: '4K',
    overview: 'Tiga puluh tahun setelah peristiwa film pertama, seorang blade runner baru, Petugas K dari LAPD, mengungkap rahasia yang telah lama terkubur.',
    genres: [{ id: '2', name: 'Action', slug: 'action' }, { id: '3', name: 'Sci-Fi', slug: 'science-fiction' }, { id: '4', name: 'Drama', slug: 'drama' }],
  },
  {
    id: 'fb-3',
    title: 'Avatar: Seven Havens',
    slug: 'avatar-seven-havens-2026',
    posterPath: '/9dZCAQTPHwgszqtqJVMt4eQ9YqK.jpg',
    backdropPath: '/pffbKZzIWKjA21XPKqECAKkSBEW.jpg',
    contentType: 'tv_series',
    voteAverage: '9.8',
    firstAirDate: '2026-10-09',
    quality: 'WEB-DL',
    overview: 'Di dunia yang hancur oleh bencana alam dahsyat, seorang pengendali bumi muda menemukan bahwa dia adalah Avatar baru setelah Korra.',
    genres: [{ id: '1', name: 'Animation', slug: 'animation' }, { id: '2', name: 'Action', slug: 'action' }, { id: '5', name: 'Adventure', slug: 'adventure' }],
  },
  {
    id: 'fb-4',
    title: 'Squid Game S2',
    slug: 'squid-game-2021',
    posterPath: '/dDlGOGLjjD1b4qSg0Xy5W2q0R.jpg',
    backdropPath: '/7tN0a4Z50kR6pW44xS0hDqX.jpg',
    contentType: 'tv_series',
    voteAverage: '8.8',
    firstAirDate: '2024-12-26',
    country: 'KR',
    quality: '4K',
    overview: 'Ratusan pemain yang terlilit hutang menerima undangan aneh untuk bersaing dalam permainan anak-anak untuk hadiah uang tunai besar.',
    genres: [{ id: '2', name: 'Action', slug: 'action' }, { id: '6', name: 'Thriller', slug: 'thriller' }],
  },
  {
    id: 'fb-5',
    title: 'The Hunt',
    slug: 'the-hunt-2012',
    posterPath: '/jkixsXzRh28q3PCqFoWcf7unghT.jpg',
    backdropPath: '/jmVWlCZ8hRtmrQGbKXXFHsrSohp.jpg',
    contentType: 'movie',
    voteAverage: '8.1',
    releaseDate: '2012-10-25',
    quality: 'BLU-RAY',
    overview: 'Seorang guru menjalani kehidupan yang sepi sementara berjuang mendapatkan hak asuh putranya hingga sebuah kebohongan kecil merusaknya.',
    genres: [{ id: '4', name: 'Drama', slug: 'drama' }],
  },
];

export const FALLBACK_HOME: HomeData = {
  above: [
    {
      id: 'fb-sec-1',
      type: 'featured',
      title: 'Featured Spotlight',
      slug: 'featured',
      data: FALLBACK_TRENDING,
    },
    {
      id: 'fb-sec-2',
      type: 'trending',
      title: 'Trending Now',
      slug: 'trending-now',
      data: FALLBACK_TRENDING,
    },
  ],
  below: [
    {
      id: 'fb-sec-3',
      type: 'latest_movies',
      title: 'New Movies',
      slug: 'new-movies',
      data: FALLBACK_TRENDING.filter((m) => m.contentType === 'movie'),
    },
    {
      id: 'fb-sec-4',
      type: 'latest_series',
      title: 'Latest Series',
      slug: 'latest-series',
      data: FALLBACK_TRENDING.filter((m) => m.contentType === 'tv_series'),
    },
  ],
};
