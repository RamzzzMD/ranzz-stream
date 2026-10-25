// ─── RANZZ STREAM TYPES ───

export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export interface Country {
  code: string;
  name: string;
}

export interface MediaItem {
  id: string;
  title: string;
  slug: string;
  originalTitle?: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  logoPath?: string | null;
  releaseDate?: string;
  firstAirDate?: string;
  voteAverage?: string | number;
  viewCount?: number;
  quality?: string | null;
  country?: string;
  runtime?: number;
  originalLanguage?: string;
  contentType?: 'movie' | 'tv_series' | 'series' | 'episode' | string;
  genres?: Genre[] | string[];
  overview?: string;
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  commentCount?: number;
  hasVideo?: boolean;
  networks?: string[];
}

export interface HomeSection {
  id: string;
  type: string;
  title: string;
  slug: string;
  description?: string;
  sortOrder?: number;
  data: MediaItem[] | { id: string; contentType: string; content: MediaItem }[];
}

export interface HomeData {
  above?: HomeSection[];
  below?: HomeSection[];
}

export interface CastMember {
  id: string;
  name: string;
  character: string;
  profilePath?: string | null;
  order?: number;
}

export interface Episode {
  id: string;
  seasonId?: string;
  tvSeriesId?: string;
  tmdbId?: number;
  episodeNumber: number;
  name: string;
  overview?: string;
  stillPath?: string | null;
  airDate?: string;
  runtime?: number;
  voteAverage?: string | number;
  viewCount?: number;
  hasVideo?: boolean;
}

export interface Season {
  id: string;
  tvSeriesId?: string;
  seasonNumber: number;
  name: string;
  overview?: string;
  posterPath?: string | null;
  airDate?: string;
  episodeCount?: number;
  episodes?: Episode[];
}

export interface MovieDetail extends MediaItem {
  overview?: string;
  tagline?: string;
  runtime?: number;
  director?: string;
  directorProfilePath?: string | null;
  trailerUrl?: string;
  cast?: CastMember[];
  backdrops?: string[];
}

export interface SeriesDetail extends MediaItem {
  overview?: string;
  tagline?: string;
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  trailerUrl?: string;
  cast?: CastMember[];
  seasons?: Season | Season[];
  defaultSeason?: Season;
  backdrops?: string[];
  networks?: any;
}

export interface CollectionItem {
  id: string;
  slug: string;
  title: string;
  description?: string;
  kind?: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  itemCount?: number;
  firstReleaseDate?: string;
  lastReleaseDate?: string;
}

export interface CollectionDetail {
  collection: CollectionItem;
  sections?: {
    id: string;
    title: string;
    items: MediaItem[];
  }[];
}

export interface QualityOption {
  quality: string;
  bandwidth: number | null;
  url: string;
}

export interface SubtitleOption {
  lang: string;
  label: string;
  url: string;
}

export interface StreamData {
  title: string;
  videoId: string;
  masterManifest: string;
  qualities: QualityOption[];
  subtitles: SubtitleOption[];
  expiresAt?: number;
  ttlSeconds?: number;
}

export interface FilterOptions {
  genres: Genre[];
  countries: Country[];
  years: string[];
  qualities?: string[];
}
