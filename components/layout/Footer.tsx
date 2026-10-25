import React from 'react';
import Link from 'next/link';
import { Send, MessageCircle, Globe, Shield } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-zinc-800/80 bg-[#09090b]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Kolom 1: About & Brand */}
          <div className="space-y-3">
            <BrandLogo size="md" showTagline={true} />
            <p className="text-sm text-zinc-400 leading-relaxed pt-1">
              Platform streaming modern menyajikan ribuan film, drama Korea, serial TV, dan anime pilihan dengan kualitas jernih dan navigasi yang cepat.
            </p>
          </div>

          {/* Kolom 2: Jelajahi */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Kategori
            </h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/kdrama" className="hover:text-white transition-colors">
                  Drama Korea
                </Link>
              </li>
              <li>
                <Link href="/movies" className="hover:text-white transition-colors">
                  Film Bioskop
                </Link>
              </li>
              <li>
                <Link href="/series" className="hover:text-white transition-colors">
                  Serial TV
                </Link>
              </li>
              <li>
                <Link href="/anime" className="hover:text-white transition-colors">
                  Anime
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-white transition-colors">
                  Koleksi & Waralaba
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Legal & Privasi */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Informasi
            </h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <span className="text-xs text-zinc-500 leading-relaxed block">
                  RANZZ STREAM tidak menyimpan berkas video di server kami. Seluruh metadata dan pemutaran bersumber dari penyedia pihak ketiga yang terindeks secara publik.
                </span>
              </li>
              <li className="pt-1 flex items-center gap-1.5 text-xs text-zinc-400">
                <Shield className="w-3.5 h-3.5 text-zinc-400" />
                <span>Koneksi Aman & Terenkripsi SSL</span>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Social & Kontak Owner */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Kontak
            </h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <a
                  href="https://ranzzajaah.bio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Globe className="w-4 h-4 text-zinc-400" />
                  <span>ranzzajaah.bio</span>
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/cangcuthideung"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Send className="w-4 h-4 text-zinc-400" />
                  <span>Telegram: @cangcuthideung</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/6281214300828"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-zinc-400" />
                  <span>WhatsApp: +62 812-1430-0828</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Mandatory Copyright */}
        <div className="mt-12 pt-6 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <p className="font-sans">
            © 2025 RANZZ STREAM — Powered by Ranzz ·{' '}
            <a
              href="https://ranzzajaah.bio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white underline underline-offset-2 transition-colors"
            >
              ranzzajaah.bio
            </a>
          </p>

          <p className="text-zinc-500">
            Platform Hiburan Minimalis
          </p>
        </div>
      </div>
    </footer>
  );
}
