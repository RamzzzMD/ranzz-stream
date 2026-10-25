'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  Settings,
  Captions,
  Activity,
  Radio,
  Clock,
  Gauge,
} from 'lucide-react';
import type { QualityOption, SubtitleOption } from '@/lib/types';
import QualitySelector from './QualitySelector';
import SubtitleMenu from './SubtitleMenu';
import SpeedMenu from './SpeedMenu';
import NextEpisode from './NextEpisode';

interface NeonPlayerProps {
  src: string; // masterManifest m3u8
  title: string;
  poster?: string;
  qualities?: QualityOption[];
  subtitles?: SubtitleOption[];
  expiresAt?: number;
  watermark?: string;
  nextEpisodeHref?: string;
  nextEpisodeTitle?: string;
}

interface VttCue {
  start: number;
  end: number;
  text: string;
}

function parseVttTimestamp(timeStr: string): number {
  if (!timeStr) return 0;
  const cleaned = timeStr.trim().replace(',', '.');
  const parts = cleaned.split(':');
  if (parts.length === 3) {
    return parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);
  }
  if (parts.length === 2) {
    return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
  }
  return parseFloat(cleaned) || 0;
}

function parseWebVttCues(raw: string): VttCue[] {
  const cues: VttCue[] = [];
  const normalized = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const blocks = normalized.split(/\n\s*\n/);

  for (const block of blocks) {
    const lines = block.trim().split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('-->')) {
        const [startPart, endPart] = line.split('-->');
        const start = parseVttTimestamp(startPart);
        const end = parseVttTimestamp(endPart.trim().split(' ')[0]);
        const text = lines
          .slice(i + 1)
          .join('\n')
          .replace(/<\/?[^>]+(>|$)/g, '')
          .trim();
        if (text && !isNaN(start) && !isNaN(end)) {
          cues.push({ start, end, text });
        }
        break;
      }
    }
  }
  return cues;
}

export default function NeonPlayer({
  src,
  title,
  poster,
  qualities = [],
  subtitles = [],
  expiresAt,
  watermark = 'RANZZ · ranzzajaah.bio',
  nextEpisodeHref,
  nextEpisodeTitle,
}: NeonPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [bootStep, setBootStep] = useState(0);

  const [qualityMenuOpen, setQualityMenuOpen] = useState(false);
  const [subtitleMenuOpen, setSubtitleMenuOpen] = useState(false);
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [currentQuality, setCurrentQuality] = useState('auto');

  // Subtitle auto-activation & cue state
  const [activeSubtitle, setActiveSubtitle] = useState<string | null>(null);
  const [vttCues, setVttCues] = useState<VttCue[]>([]);
  const [currentSubtitleText, setCurrentSubtitleText] = useState<string>('');

  const [remainingTtl, setRemainingTtl] = useState<number | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-activate Indonesian subtitle by default whenever subtitles are provided
  useEffect(() => {
    if (subtitles.length > 0 && activeSubtitle === null) {
      const preferred =
        subtitles.find(
          (s) =>
            s.lang?.toLowerCase() === 'id' ||
            s.lang?.toLowerCase() === 'ind' ||
            s.label?.toLowerCase().includes('indo')
        ) || subtitles[0];
      if (preferred) {
        setActiveSubtitle(preferred.lang);
      }
    }
  }, [subtitles, activeSubtitle]);

  // Load and parse VTT cues when activeSubtitle changes
  useEffect(() => {
    if (!activeSubtitle) {
      setVttCues([]);
      setCurrentSubtitleText('');
      return;
    }

    const sub = subtitles.find((s) => s.lang === activeSubtitle);
    if (!sub || !sub.url) return;

    fetch(sub.url)
      .then((res) => res.text())
      .then((text) => {
        const parsed = parseWebVttCues(text);
        setVttCues(parsed);
      })
      .catch((err) => console.warn('Failed to parse subtitle VTT:', err));
  }, [activeSubtitle, subtitles]);

  // Synchronize on-screen subtitle text with currentTime
  useEffect(() => {
    if (!vttCues.length || !activeSubtitle) {
      if (currentSubtitleText) setCurrentSubtitleText('');
      return;
    }

    const match = vttCues.find((c) => currentTime >= c.start && currentTime <= c.end);
    const newText = match ? match.text : '';
    if (newText !== currentSubtitleText) {
      setCurrentSubtitleText(newText);
    }
  }, [currentTime, vttCues, activeSubtitle, currentSubtitleText]);

  // ─── CYBERPUNK BOOT SEQUENCE LOADER ───
  useEffect(() => {
    setIsLoading(true);
    setBootStep(1);
    const t1 = setTimeout(() => setBootStep(2), 400);
    const t2 = setTimeout(() => setBootStep(3), 850);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [src]);

  // ─── TTL STREAM COUNTDOWN ───
  useEffect(() => {
    if (!expiresAt) return;
    const updateTtl = () => {
      const now = Math.floor(Date.now() / 1000);
      const diff = Math.max(0, expiresAt - now);
      setRemainingTtl(diff);
    };
    updateTtl();
    const interval = setInterval(updateTtl, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  // ─── HLS.JS VIDEO ENGINE INITIALIZATION ───
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    if (Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });

      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Safari HLS
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src]);

  // ─── SUBTITLE TRACK HANDLING (NATIVE) ───
  // Intentionally set to 'hidden' so the browser parses tracks internally if required,
  // but DOES NOT render duplicate native subtitle boxes over our Cyberpunk Neon overlay.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !video.textTracks) return;

    for (let i = 0; i < video.textTracks.length; i++) {
      video.textTracks[i].mode = 'hidden';
    }
  }, [subtitles, activeSubtitle]);

  // Keep video playbackRate in sync
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, src]);

  // ─── PLAYER CONTROLS ───
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSeekRelative = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    const target = Math.max(0, Math.min(video.duration || 0, video.currentTime + seconds));
    video.currentTime = target;
    setCurrentTime(target);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const val = parseFloat(e.target.value);
    video.volume = val;
    video.muted = val === 0;
    setVolume(val);
    setIsMuted(val === 0);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullscreen(false);
    }
  };

  const handleQualityChange = (url: string, qualityName: string) => {
    setCurrentQuality(qualityName);
    const video = videoRef.current;
    const lastTime = video ? video.currentTime : 0;
    const wasPlaying = video ? !video.paused : false;

    if (hlsRef.current) {
      if (url === 'auto') {
        hlsRef.current.loadSource(src);
      } else {
        hlsRef.current.loadSource(url);
      }
      if (video) {
        hlsRef.current.attachMedia(video);
        video.currentTime = lastTime;
        video.playbackRate = playbackSpeed;
        if (wasPlaying) video.play();
      }
    }
  };

  // ─── AUTO HIDE CONTROLS ON IDLE ───
  const handleMouseMove = () => {
    setControlsVisible(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setControlsVisible(false);
      }
    }, 3500);
  };

  // ─── KEYBOARD NAVIGATION (SPACE, ARROWS, J/L, SPEED </> , F, M) ───
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Abaikan jika fokus pada input teks
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight' || e.code === 'KeyL') {
        e.preventDefault();
        handleSeekRelative(10);
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyJ') {
        e.preventDefault();
        handleSeekRelative(-10);
      } else if (e.code === 'Period') {
        // '>' or '.' to speed up
        e.preventDefault();
        setPlaybackSpeed((prev) => {
          const next = Math.min(2.0, parseFloat((prev + 0.25).toFixed(2)));
          if (videoRef.current) videoRef.current.playbackRate = next;
          return next;
        });
      } else if (e.code === 'Comma') {
        // '<' or ',' to slow down
        e.preventDefault();
        setPlaybackSpeed((prev) => {
          const next = Math.max(0.5, parseFloat((prev - 0.25).toFixed(2)));
          if (videoRef.current) videoRef.current.playbackRate = next;
          return next;
        });
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay]);

  const formatSeconds = (sec: number) => {
    if (isNaN(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-zinc-800 select-none group"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        poster={poster}
        playsInline
        crossOrigin="anonymous"
        onClick={togglePlay}
        onTimeUpdate={() => {
          if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
          }
        }}
        onDurationChange={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
          }
        }}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
        className="w-full h-full object-contain cursor-pointer"
      >
        {subtitles.map((sub, idx) => (
          <track
            key={`${sub.lang}-${idx}`}
            kind="subtitles"
            label={sub.label}
            srcLang={sub.lang}
            src={sub.url}
          />
        ))}
      </video>

      {/* Minimalist Subtitle Overlay */}
      {currentSubtitleText && (
        <div className="absolute bottom-16 sm:bottom-20 inset-x-4 flex justify-center pointer-events-none z-30 transition-all duration-100">
          <div className="bg-black/85 border border-white/10 text-white font-medium text-sm sm:text-base px-3.5 py-1.5 rounded-lg max-w-2xl text-center shadow-lg backdrop-blur-sm whitespace-pre-line leading-relaxed">
            {currentSubtitleText}
          </div>
        </div>
      )}

      {/* Watermark Pojok Kanan Atas */}
      <div
        className={`absolute top-3.5 right-3.5 z-20 pointer-events-none transition-opacity duration-200 ${
          controlsVisible ? 'opacity-80' : 'opacity-25'
        }`}
      >
        <span className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase bg-black/60 px-2 py-0.5 rounded border border-white/5">
          {watermark}
        </span>
      </div>

      {/* Minimalist Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          <div className="w-9 h-9 rounded-full border-2 border-zinc-700 border-t-white animate-spin mb-3" />
          <p className="text-xs text-zinc-300 font-medium">Memuat video...</p>
        </div>
      )}

      {/* Now Playing Title (Kiri Atas saat hover) */}
      <div
        className={`absolute top-3.5 left-3.5 z-20 transition-opacity duration-200 pointer-events-none ${
          controlsVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-black/70 border border-white/10 backdrop-blur-md">
          <span className="text-xs font-semibold text-zinc-200 line-clamp-1 max-w-[200px] sm:max-w-sm">
            {title}
          </span>
        </div>
      </div>

      {remainingTtl !== null && remainingTtl <= 600 && (
        <div className="absolute top-14 left-3.5 z-20 flex items-center gap-2 px-3 py-1 rounded-md bg-red-950/80 border border-red-800 text-zinc-200 text-xs backdrop-blur-md">
          <Clock className="w-3.5 h-3.5 text-red-400" />
          <span>Sesi stream: {Math.floor(remainingTtl / 60)}m {remainingTtl % 60}s</span>
          <button
            onClick={() => window.location.reload()}
            className="ml-1 underline hover:text-white"
          >
            Muat Ulang
          </button>
        </div>
      )}

      {/* KONTROL PLAYER BAWAH */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-20 p-3 sm:p-4 bg-gradient-to-t from-black via-black/80 to-transparent transition-opacity duration-200 ${
          controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Minimal Progress Slider */}
        <div className="relative flex items-center mb-2.5">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step="any"
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#e50914] hover:h-1.5 transition-all"
            style={{
              background: `linear-gradient(to right, #e50914 ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.15) ${(currentTime / (duration || 1)) * 100}%)`,
            }}
            aria-label="Posisi pemutaran video"
          />
        </div>

        {/* Baris Tombol Kontrol */}
        <div className="flex items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-2">
            {/* Play / Pause Toggle */}
            <button
              onClick={togglePlay}
              className="p-2 rounded-md bg-white text-black hover:bg-zinc-200 transition-colors"
              aria-label={isPlaying ? 'Jeda video' : 'Putar video'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            {/* Rewind 10s */}
            <button
              onClick={() => handleSeekRelative(-10)}
              className="p-1.5 rounded-md border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
              aria-label="Mundur 10 detik"
              title="Mundur 10s (←)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Forward 10s */}
            <button
              onClick={() => handleSeekRelative(10)}
              className="p-1.5 rounded-md border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
              aria-label="Maju 10 detik"
              title="Maju 10s (→)"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            {/* Next Episode Button */}
            {nextEpisodeHref && (
              <NextEpisode
                onNext={() => {
                  window.location.href = nextEpisodeHref;
                }}
                nextTitle={nextEpisodeTitle}
              />
            )}

            {/* Volume & Mute */}
            <div className="hidden sm:flex items-center gap-1.5 ml-1">
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-md text-zinc-400 hover:text-white transition-colors"
                aria-label={isMuted ? 'Nyalakan suara' : 'Bisukan suara'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-14 sm:w-18 h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-white"
                aria-label="Atur volume suara"
              />
            </div>

            {/* Durasi */}
            <div className="font-mono text-[11px] text-zinc-400 ml-1">
              <span className="text-zinc-200">{formatSeconds(currentTime)}</span>
              <span className="mx-1 text-zinc-600">/</span>
              <span>{formatSeconds(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 relative">
            {/* Speed Control Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setSpeedMenuOpen(!speedMenuOpen);
                  setSubtitleMenuOpen(false);
                  setQualityMenuOpen(false);
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium transition-colors ${
                  playbackSpeed !== 1.0
                    ? 'border-[#e50914] text-[#e50914] bg-red-950/20'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
                aria-label="Pilih kecepatan putar"
                title="Kecepatan Putar"
              >
                <Gauge className="w-3.5 h-3.5" />
                <span className="text-[11px]">{playbackSpeed}x</span>
              </button>

              <SpeedMenu
                currentSpeed={playbackSpeed}
                onSelect={handleSpeedChange}
                isOpen={speedMenuOpen}
                onClose={() => setSpeedMenuOpen(false)}
              />
            </div>

            {/* Subtitle Button */}
            {subtitles.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => {
                    setSubtitleMenuOpen(!subtitleMenuOpen);
                    setQualityMenuOpen(false);
                    setSpeedMenuOpen(false);
                  }}
                  className={`p-1.5 rounded-md border transition-colors ${
                    activeSubtitle
                      ? 'border-[#e50914] text-[#e50914] bg-red-950/20'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                  aria-label="Pilih teks subtitle"
                  title="Subtitle"
                >
                  <Captions className="w-4 h-4" />
                </button>

                <SubtitleMenu
                  subtitles={subtitles}
                  activeSubtitle={activeSubtitle}
                  onSelect={(lang) => setActiveSubtitle(lang)}
                  isOpen={subtitleMenuOpen}
                  onClose={() => setSubtitleMenuOpen(false)}
                />
              </div>
            )}

            {/* Quality Button */}
            {qualities.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => {
                    setQualityMenuOpen(!qualityMenuOpen);
                    setSubtitleMenuOpen(false);
                    setSpeedMenuOpen(false);
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded-md border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:border-zinc-700 text-xs transition-colors"
                  aria-label="Pilih resolusi kualitas"
                  title="Resolusi Kualitas"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span className="uppercase text-[11px]">{currentQuality}</span>
                </button>

                <QualitySelector
                  qualities={qualities}
                  currentQuality={currentQuality}
                  onSelect={handleQualityChange}
                  isOpen={qualityMenuOpen}
                  onClose={() => setQualityMenuOpen(false)}
                />
              </div>
            )}

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-md border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
              aria-label={isFullscreen ? 'Keluar layar penuh' : 'Layar penuh'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}