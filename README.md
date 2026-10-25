# ⚡ RANZZ STREAM (RanzzFlix)

> **"Neon Nights. Infinite Stories."**  
> Platform streaming film, serial TV, drama Korea, dan anime retro-futuristik berkecepatan tinggi dengan visual Cyberpunk × Synthwave 80s.

---

## 🚀 Fitur Unggulan

- **Cyberpunk × Synthwave UI**: Animated perspective grid, scanlines CRT overlay, neon borders, chrome text, dan retro vaporwave sun.
- **Data Integrasi Scraper IDLIX**: Mengambil data katalog film, trending, serial, episode, dan master manifest streaming secara live.
- **Custom NeonPlayer**:
  - HLS engine (hls.js) playback
  - Seleksi resolusi & kualitas video
  - Trek subtitle WebVTT
  - Countdown TTL stream + tombol refresh stream
  - Deteksi dan tombol putar otomatis episode berikutnya
  - Animasi equalizer visualizer "NOW PLAYING"
  - Navigasi keyboard penuh (`Space`, `←` / `→`, `F`, `M`)
  - Watermark pojok kanan atas `RANZZ · ranzzajaah.bio`
- **Katalog Lengkap**:
  - **Movies**: Filter negara, tahun, genre, dan sorting
  - **Series**: Navigasi per musim dan episode grid
  - **Anime Spotlight**: Filter animasi Jepang
  - **K-Drama**: Filter drama Korea dan film Korea Selatan
  - **Collections**: Semesta waralaba film (Marvel, Star Wars, dll)
  - **Search**: Debounced database search dengan state *NO SIGNAL FOUND*
- **SEO & Performa**:
  - Metadata dinamis per halaman
  - Custom TMDB image loader
  - Sitemap & robots.txt otomatis
  - Mobile-first responsive design

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: TailwindCSS + Design System Neon
- **State**: Zustand (Watchlist & Player Preferences)
- **Video Engine**: Hls.js
- **Icons**: Lucide React
- **Runtime**: Node.js (untuk scraper & route streaming)

---

## 📦 Cara Install & Menjalankan

### 1. Prasyarat
- Node.js versi 18.x atau lebih baru
- npm / yarn / pnpm

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment (Opsional)
Salin `.env.example` ke `.env.local`:
```bash
cp .env.example .env.local
```

### 4. Jalankan Development Server
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

### 5. Build untuk Produksi
```bash
npm run build
npm start
```

---

## 👑 Owner & Kontak
- **Owner**: Ranzz
- **Website**: [ranzzajaah.bio](https://ranzzajaah.bio)
- **Telegram**: [@cangcuthideung](https://t.me/cangcuthideung)
- **WhatsApp**: [+62 812-1430-0828](https://wa.me/6281214300828)

© 2025 RANZZ STREAM — Powered by Ranzz · ranzzajaah.bio
