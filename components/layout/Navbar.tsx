'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Bookmark,
  Bell,
  Menu,
  X,
  ExternalLink,
  Send,
  MessageCircle,
  Globe,
  Film,
  Tv,
  Sparkles,
  Flame,
  ChevronDown,
} from 'lucide-react';
import { useWatchlistStore } from '@/lib/store';
import BrandLogo from './BrandLogo';

const NAV_LINKS = [
  { label: 'Beranda', href: '/' },
  { label: 'Drama', href: '/kdrama' },
  { label: 'Film', href: '/movies' },
  { label: 'Anime', href: '/anime' },
  { label: 'Katalog', href: '/collections' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const watchlistItems = useWatchlistStore((s) => s.items);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-200 ${
          scrolled
            ? 'bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-800/80 shadow-sm'
            : 'bg-gradient-to-b from-[#09090b]/90 via-[#09090b]/50 to-transparent'
        }`}
      >
        <div className="h-16 w-full px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          {/* Logo & Main Nav Links */}
          <div className="flex items-center gap-6 lg:gap-8 flex-shrink-0">
            <BrandLogo size="md" showWordmark={true} />

            <nav className="hidden lg:flex items-center gap-1 ml-2" aria-label="Menu Utama">
              {NAV_LINKS.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-white bg-zinc-800/80'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Area: Search, Notifications, Watchlist, Profile */}
          <div className="flex items-center gap-2.5 flex-1 max-w-xl justify-end">
            {/* Quick Search Input */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative w-full max-w-xs md:max-w-sm hidden sm:block"
            >
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari film, serial, anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/90 text-white placeholder:text-zinc-500 text-xs sm:text-sm pl-10 pr-4 py-2 rounded-lg border border-zinc-800 outline-none focus:border-zinc-600 transition-colors"
                aria-label="Cari drama, film, anime"
              />
            </form>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* Notification Bell */}
              <button
                type="button"
                onClick={() => router.push('/collections')}
                className="relative p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800/50"
                aria-label="Notifikasi Rilis Baru"
                title="Notifikasi"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#e50914] rounded-full" />
              </button>

              {/* Watchlist Quick Button */}
              <Link
                href="/collections"
                className="relative p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
                aria-label={`Daftar Tontonan (${watchlistItems.length})`}
                title="Daftar Tontonan"
              >
                <Bookmark className="w-4 h-4" />
                {watchlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#e50914] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {watchlistItems.length}
                  </span>
                )}
              </Link>

              {/* Owner Profile Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
                  aria-label="Informasi Pemilik Ranzz"
                  title="Owner: Ranzz"
                >
                  <div className="w-6 h-6 rounded-md bg-[#e50914] flex items-center justify-center font-bold text-xs text-white">
                    R
                  </div>
                  <span className="hidden md:inline text-xs font-semibold text-zinc-200">
                    Ranzz
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 hidden md:block" />
                </button>

                {profileOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl py-2 px-2 z-50 animate-in fade-in"
                    onMouseLeave={() => setProfileOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-zinc-800 mb-1">
                      <p className="text-xs font-bold text-white">
                        RANZZ <span className="text-[#e50914]">STREAM</span>
                      </p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Created by <span className="text-white font-medium">Ranzz</span>
                      </p>
                    </div>

                    <a
                      href="https://ranzzajaah.bio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                    >
                      <Globe className="w-4 h-4 text-zinc-400" />
                      <span>ranzzajaah.bio</span>
                      <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                    </a>

                    <a
                      href="https://t.me/cangcuthideung"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                    >
                      <Send className="w-4 h-4 text-zinc-400" />
                      <span>Telegram @cangcuthideung</span>
                      <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                    </a>

                    <a
                      href="https://wa.me/6281214300828"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-zinc-400" />
                      <span>WhatsApp (+6281214300828)</span>
                      <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                    </a>
                  </div>
                )}
              </div>

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#09090b]/95 border-b border-zinc-800 px-4 py-4 backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
            {/* Mobile Search Form */}
            <form onSubmit={handleSearchSubmit} className="relative mb-3">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari film, serial, anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 text-white placeholder:text-zinc-500 text-sm pl-10 pr-4 py-2.5 rounded-lg border border-zinc-800 outline-none focus:border-zinc-600"
              />
            </form>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-zinc-800 text-white font-semibold'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
