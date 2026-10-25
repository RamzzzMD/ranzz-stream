// ─── IDLIX SCRAPER TYPINGS (READ-ONLY WRAPPER) ───
import type { StreamData } from './types';

export function getHome(): Promise<any>;
export function getTrending(): Promise<any>;
export function getPopular(type?: string, page?: number): Promise<any>;
export function getLatestMovies(page?: number): Promise<any>;
export function getLatestSeries(page?: number): Promise<any>;
export function getMovies(params?: Record<string, any>): Promise<any>;
export function getSeries(params?: Record<string, any>): Promise<any>;
export function getMovieFilterOptions(): Promise<any>;
export function getSeriesFilterOptions(): Promise<any>;
export function getCollections(cursor?: string): Promise<any>;
export function getCollectionDetail(slug: string): Promise<any>;
export function getNetworkDetail(slug: string): Promise<any>;
export function getCountries(): Promise<any[]>;
export function getYears(): Promise<string[]>;
export function search(query: string): Promise<any[]>;
export function getMovieDetail(slugOrId: string): Promise<any>;
export function getSeriesDetail(slugOrId: string): Promise<any>;
export function getSeasonEpisodes(seriesSlugOrId: string, seasonNumber?: number): Promise<any>;
export function getRelated(slugOrId: string, type?: string): Promise<any[]>;
export function parseTargetQuery(query: string): { title: string; season: number | null; episode: number | null };
export function getStream(target: any, options?: Record<string, any>): Promise<StreamData>;
export function download(urlOrIdOrQuery: any, options?: Record<string, any>): Promise<any>;

declare const idlix: {
  getHome: typeof getHome;
  getTrending: typeof getTrending;
  getPopular: typeof getPopular;
  getLatestMovies: typeof getLatestMovies;
  getLatestSeries: typeof getLatestSeries;
  getMovies: typeof getMovies;
  getSeries: typeof getSeries;
  getMovieFilterOptions: typeof getMovieFilterOptions;
  getSeriesFilterOptions: typeof getSeriesFilterOptions;
  getCollections: typeof getCollections;
  getCollectionDetail: typeof getCollectionDetail;
  getNetworkDetail: typeof getNetworkDetail;
  getCountries: typeof getCountries;
  getYears: typeof getYears;
  search: typeof search;
  getMovieDetail: typeof getMovieDetail;
  getSeriesDetail: typeof getSeriesDetail;
  getSeasonEpisodes: typeof getSeasonEpisodes;
  getRelated: typeof getRelated;
  parseTargetQuery: typeof parseTargetQuery;
  getStream: typeof getStream;
  download: typeof download;
};

export default idlix;
