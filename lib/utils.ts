import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRating(val?: string | number): string {
  if (val === undefined || val === null || val === '') return 'N/A';
  const num = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(num)) return 'N/A';
  return num.toFixed(1);
}

export function formatRuntime(minutes?: number): string {
  if (!minutes || minutes <= 0) return '';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0) return `${hrs}j ${mins}m`;
  return `${mins}m`;
}

export function formatYear(dateStr?: string): string {
  if (!dateStr) return '';
  return dateStr.slice(0, 4);
}

export function formatViews(views?: number): string {
  if (!views) return '0';
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}k`;
  return views.toString();
}

export function getImageUrl(path?: string | null, size = 'w500'): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `https://image.tmdb.org/t/p/${size}${clean}`;
}
