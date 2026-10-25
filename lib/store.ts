'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MediaItem } from './types';

// ─── WATCHLIST STORE ───
interface WatchlistState {
  items: MediaItem[];
  add: (item: MediaItem) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
  toggle: (item: MediaItem) => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        if (!get().has(item.id)) {
          set({ items: [item, ...get().items] });
        }
      },
      remove: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      has: (id) => get().items.some((i) => i.id === id),
      toggle: (item) => {
        if (get().has(item.id)) {
          get().remove(item.id);
        } else {
          get().add(item);
        }
      },
    }),
    { name: 'ranzz-watchlist' }
  )
);

// ─── PLAYER STATE STORE ───
interface PlayerState {
  volume: number;
  muted: boolean;
  quality: string;
  preferredSubtitle: string;
  setVolume: (v: number) => void;
  setMuted: (m: boolean) => void;
  setQuality: (q: string) => void;
  setPreferredSubtitle: (lang: string) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      volume: 1,
      muted: false,
      quality: 'default',
      preferredSubtitle: 'id',
      setVolume: (volume) => set({ volume }),
      setMuted: (muted) => set({ muted }),
      setQuality: (quality) => set({ quality }),
      setPreferredSubtitle: (preferredSubtitle) => set({ preferredSubtitle }),
    }),
    { name: 'ranzz-player-prefs' }
  )
);

// ─── THEME & VISUAL FX STORE ───
interface VisualFxState {
  gridActive: boolean;
  scanlinesActive: boolean;
  flickerActive: boolean;
  setGridActive: (active: boolean) => void;
  setScanlinesActive: (active: boolean) => void;
  setFlickerActive: (active: boolean) => void;
}

export const useVisualFxStore = create<VisualFxState>()(
  persist(
    (set) => ({
      gridActive: true,
      scanlinesActive: true,
      flickerActive: true,
      setGridActive: (gridActive) => set({ gridActive }),
      setScanlinesActive: (scanlinesActive) => set({ scanlinesActive }),
      setFlickerActive: (flickerActive) => set({ flickerActive }),
    }),
    { name: 'ranzz-fx-prefs' }
  )
);
