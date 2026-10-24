import React, { useState, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import FigureArtwork from './FigureArtwork';
import GlbModelViewer from './GlbModelViewer';

export default function FigureCard3D({
  figure,
  isAudioPlaying,
  isAudioEnabled,
  onHoverStart,
  onHoverEnd,
  scrollProgress,
}) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });

  // Calculate 3D rotation (±16 deg) and dynamic spotlight glare from cursor/touch coordinates
  const updateTiltFromPoint = useCallback((clientX, clientY) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normX = (clientX - centerX) / (rect.width / 2); // -1 to 1
    const normY = (clientY - centerY) / (rect.height / 2); // -1 to 1

    const clampedX = Math.max(-1, Math.min(1, normX));
    const clampedY = Math.max(-1, Math.min(1, normY));

    // RotateX & RotateY up to ±16 degrees per plan specification
    const rotateY = clampedX * 16;
    const rotateX = -clampedY * 16;

    const glareX = ((clampedX + 1) / 2) * 100;
    const glareY = ((clampedY + 1) / 2) * 100;

    setTilt({ rotateX, rotateY, glareX, glareY });
  }, []);

  const handleMouseEnter = (e) => {
    setIsHovered(true);
    updateTiltFromPoint(e.clientX, e.clientY);
    onHoverStart?.(figure);
  };

  const handleMouseMove = (e) => {
    if (!isHovered) setIsHovered(true);
    updateTiltFromPoint(e.clientX, e.clientY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
    onHoverEnd?.(figure);
  };

  // Mobile Touch Support per Phase 5 specification
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsHovered(true);
    if (touch) {
      updateTiltFromPoint(touch.clientX, touch.clientY);
    }
    onHoverStart?.(figure);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    if (touch) {
      updateTiltFromPoint(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
    onHoverEnd?.(figure);
  };

  const scalePercent = Math.round((0.55 + scrollProgress * 0.45) * 100);

  return (
    <div
      className="perspective-1200 w-full max-w-[430px] mx-auto select-none"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main 3D Card Container with preserve-3d */}
      <div
        ref={cardRef}
        className={`preserve-3d relative w-full h-[540px] sm:h-[580px] rounded-3xl border border-white/20 bg-gradient-to-br ${figure.cardGradient} backdrop-blur-xl shadow-2xl cursor-pointer`}
        style={{
          transform: `rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg)`,
          transition: isHovered
            ? 'transform 0.08s ease-out, box-shadow 0.3s ease'
            : 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease',
          boxShadow: isHovered
            ? `0 30px 70px -15px rgba(0,0,0,0.85), 0 0 45px 2px ${figure.glowRgba}`
            : '0 25px 50px -12px rgba(0,0,0,0.75)',
        }}
      >
        {/* ============================================================
            LAYER 1: LAYER DASAR (translateZ: 10px)
            Latar belakang gradien, grid kosmik & aura elemen
        ============================================================ */}
        <div
          className="absolute inset-3 rounded-2xl overflow-hidden pointer-events-none"
          style={{ transform: 'translateZ(10px)' }}
        >
          {/* Subtle Cyber-Forest Grid */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: `linear-gradient(to right, ${figure.accentColor}22 1px, transparent 1px), linear-gradient(to bottom, ${figure.accentColor}22 1px, transparent 1px)`,
              backgroundSize: '28px 28px',
            }}
          />

          {/* Glowing Aura Core */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle, ${figure.accentColor}66 0%, ${figure.secondaryColor}22 60%, transparent 100%)`,
              opacity: isHovered ? 0.95 : 0.45,
            }}
          />

          {/* Dynamic Spotlight Glare following Cursor */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              opacity: isHovered ? 0.85 : 0,
              background: `radial-gradient(circle 260px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.24), transparent 80%)`,
            }}
          />
        </div>

        {/* ============================================================
            LAYER 2: LAYER TENGAH (translateZ: 35px - 70px)
            Cincin hologram berputar & informasi teks / Equalizer
        ============================================================ */}
        {/* Rotating Hologram Rings (translateZ: 38px) */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ transform: 'translateZ(38px)' }}
        >
          <div
            className="w-72 h-72 sm:w-80 sm:h-80 rounded-full border-2 border-dashed animate-spin-slow transition-all duration-500"
            style={{
              borderColor: `${figure.accentColor}66`,
              boxShadow: isHovered ? `inset 0 0 28px ${figure.accentColor}44` : 'none',
            }}
          />
          <div
            className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full border border-dotted animate-spin-reverse"
            style={{
              borderColor: `${figure.secondaryColor}88`,
            }}
          />
        </div>

        {/* Top HUD Metadata & Equalizer Indicator (translateZ: 60px) */}
        <div
          className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-none"
          style={{ transform: 'translateZ(60px)' }}
        >
          <span
            className={`px-3 py-1 rounded-full text-xs font-display font-bold tracking-wider border backdrop-blur-md ${figure.badgeBg}`}
          >
            #{String(figure.index).padStart(2, '0')} // {figure.rarity}
          </span>

          {/* Real-time Audio Equalizer Badge */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md transition-all duration-300 ${
              isAudioPlaying
                ? 'bg-emerald-950/90 border-emerald-400/60 text-emerald-300 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/75 border-white/15 text-slate-400'
            }`}
          >
            {isAudioPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <div className="flex items-end gap-0.5 h-3">
                  <span
                    className="w-0.5 h-full bg-emerald-400 eq-bar-active"
                    style={{ animationDelay: '0ms' }}
                  />
                  <span
                    className="w-0.5 h-full bg-emerald-300 eq-bar-active"
                    style={{ animationDelay: '150ms' }}
                  />
                  <span
                    className="w-0.5 h-full bg-emerald-400 eq-bar-active"
                    style={{ animationDelay: '300ms' }}
                  />
                  <span
                    className="w-0.5 h-full bg-emerald-200 eq-bar-active"
                    style={{ animationDelay: '75ms' }}
                  />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-200">
                  SYNTH ON
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono uppercase tracking-wider">
                  {isAudioEnabled ? 'HOVER AUDIO' : 'AUDIO MUTED'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* ============================================================
            LAYER 3: LAYER UTAMA KARAKTER (translateZ: 85px -> 130px + scale 1.18)
            Gambar karakter / Model 3D GLB utama yang menonjol keluar saat hover
        ============================================================ */}
        <div
          className="absolute inset-x-4 top-12 bottom-24 flex items-center justify-center pointer-events-none"
          style={{
            transform: isHovered
              ? 'translateZ(130px) scale(1.18)'
              : 'translateZ(85px) scale(1.0)',
            transition: 'transform 0.42s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {figure.modelUrl ? (
            <GlbModelViewer
              modelUrl={figure.modelUrl}
              isHovered={isHovered}
              tilt={tilt}
              accentColor={figure.accentColor}
            />
          ) : (
            <FigureArtwork
              id={figure.id}
              accentColor={figure.accentColor}
              secondaryColor={figure.secondaryColor}
              isHovered={isHovered}
            />
          )}
        </div>

        {/* Bottom Floating Nameplate & 3D Depth Telemetry (translateZ: 70px) */}
        <div
          className="absolute bottom-5 left-6 right-6 p-4 rounded-2xl bg-slate-950/80 border border-white/15 backdrop-blur-md pointer-events-none"
          style={{ transform: 'translateZ(70px)' }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" style={{ color: figure.accentColor }} />
              {figure.faction}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {isHovered
                ? `Z: 130px | TILT: ${Math.round(tilt.rotateX)}°,${Math.round(tilt.rotateY)}°`
                : `Z: 85px | SCALE: ${scalePercent}%`}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-extrabold tracking-wide text-white drop-shadow">
            {figure.name}
          </h3>
          <p
            className="text-xs font-medium tracking-wide"
            style={{ color: figure.accentColor }}
          >
            {figure.title}
          </p>
        </div>
      </div>
    </div>
  );
}
