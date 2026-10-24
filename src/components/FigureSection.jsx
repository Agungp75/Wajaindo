import React, { useState, useRef, useCallback } from 'react';
import { Activity, Cpu, Shield, Compass } from 'lucide-react';

export default function FigureSection({
  figure,
  sectionRef,
  slotRef,
  progress,
}) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const isOdd = figure.direction === 'left';
  const currentScale = 0.55 + progress * 0.45;
  const currentBlur = Math.max(0, (1 - progress) * 10);

  // Smooth reversible slide for the right/left column (opposite to the 3D Kopdes side)
  const specX = (isOdd ? 120 : -120) * (1 - progress);
  const scalePercent = Math.round(currentScale * 100);
  const currentX = (isOdd ? -180 : 180) * (1 - progress);

  const updateTiltFromPoint = useCallback((clientX, clientY) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normX = Math.max(-1, Math.min(1, (clientX - centerX) / (rect.width / 2)));
    const normY = Math.max(-1, Math.min(1, (clientY - centerY) / (rect.height / 2)));

    setTilt({
      rotateY: normX * 16,
      rotateX: -normY * 16,
    });
  }, []);

  const numberLabel = `0${figure.index}`;

  return (
    <section
      ref={sectionRef}
      id={`figure-${figure.id}`}
      className="relative min-h-[92vh] py-16 sm:py-24 flex items-center justify-center px-4 sm:px-8 lg:px-16"
    >
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* 5-Column Target Slot where the Traveling 3D Kopdes Lands (Left on Odd, Right on Even) */}
        <div
          ref={slotRef}
          className={`lg:col-span-5 min-h-[320px] sm:min-h-[420px] pointer-events-none ${
            isOdd ? 'lg:order-1' : 'lg:order-2'
          }`}
        />

        {/* 7-Column Content Area (Right on Odd, Left on Even) */}
        <div
          className={`lg:col-span-7 relative z-30 will-change-scroll3d ${
            isOdd ? 'lg:order-2' : 'lg:order-1'
          }`}
          style={{
            transform: `translate3d(${specX.toFixed(1)}px, 0px, 0px) scale(${
              figure.customImage ? currentScale.toFixed(3) : '1'
            })`,
            opacity: Math.max(0.12, progress).toFixed(3),
            filter: figure.customImage ? 'none' : `blur(${(currentBlur * 0.5).toFixed(1)}px)`,
          }}
        >
          {figure.customImage ? (
            /* ============================================================
               TAMPILAN GAMBAR KHUSUS (Hanya untuk Card yang sudah diganti, misal #01)
               Dilengkapi Badge Nomor agar mudah dikenali
            ============================================================ */
            <div className="flex flex-col items-center justify-center">
              <div
                className="perspective-1200 relative w-full max-w-[440px] flex items-center justify-center select-none"
                onMouseEnter={(e) => {
                  setIsHovered(true);
                  updateTiltFromPoint(e.clientX, e.clientY);
                }}
                onMouseMove={(e) => {
                  if (!isHovered) setIsHovered(true);
                  updateTiltFromPoint(e.clientX, e.clientY);
                }}
                onMouseLeave={() => {
                  setIsHovered(false);
                  setTilt({ rotateX: 0, rotateY: 0 });
                }}
                onTouchStart={(e) => {
                  const touch = e.touches[0];
                  setIsHovered(true);
                  if (touch) updateTiltFromPoint(touch.clientX, touch.clientY);
                }}
                onTouchMove={(e) => {
                  const touch = e.touches[0];
                  if (touch) updateTiltFromPoint(touch.clientX, touch.clientY);
                }}
                onTouchEnd={() => {
                  setIsHovered(false);
                  setTilt({ rotateX: 0, rotateY: 0 });
                }}
              >
                {/* Badge Nomor di Pojok Atas Gambar */}
                <div
                  className="absolute -top-4 left-4 z-40 px-4 py-1.5 rounded-2xl bg-slate-950/85 border-2 font-display font-black text-base tracking-wider shadow-xl backdrop-blur-md"
                  style={{
                    borderColor: figure.accentColor,
                    color: figure.accentColor,
                  }}
                >
                  #{numberLabel}
                </div>

                <div
                  ref={cardRef}
                  className="preserve-3d relative w-full flex items-center justify-center cursor-pointer"
                  style={{
                    transform: `rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg)`,
                    transition: isHovered
                      ? 'transform 0.08s ease-out'
                      : 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  <img
                    src={figure.customImage}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/figur-card.jpg';
                    }}
                    alt={`Figur #${numberLabel}`}
                    className="w-full max-h-[480px] object-contain pointer-events-none select-none"
                    style={{
                      transform: isHovered
                        ? 'translateZ(110px) scale(1.14)'
                        : 'translateZ(50px) scale(1.0)',
                      transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                      filter: isHovered
                        ? `drop-shadow(0 30px 35px rgba(0,0,0,0.85)) drop-shadow(0 0 24px ${figure.accentColor}88)`
                        : 'drop-shadow(0 22px 28px rgba(0,0,0,0.75))',
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* ============================================================
               TAMPILAN CARD SPESIFIKASI ASLI (Untuk #02, #03, #04, #05, #06)
               Dilengkapi Nomor Besar (#02 - #06) agar mudah ditunjuk jika ingin diubah
            ============================================================ */
            <div className="relative rounded-3xl bg-slate-950/75 border border-white/15 backdrop-blur-xl p-6 sm:p-9 shadow-2xl">
              {/* Badge Nomor Besar & Jelas */}
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-slate-900/95 border-2 font-display font-black text-base sm:text-lg tracking-wider shadow-lg mb-4"
                style={{
                  borderColor: figure.accentColor,
                  color: figure.accentColor,
                }}
              >
                <span>CARD #{numberLabel}</span>
              </div>

              {/* Live Reversible Scroll Telemetry Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full animate-pulse"
                    style={{ backgroundColor: figure.accentColor }}
                  />
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-300">
                    NOMOR {numberLabel} // {isOdd ? 'POSISI KIRI → KANAN' : 'POSISI KANAN → KIRI'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-emerald-300">
                    PROGRESS: {progress.toFixed(2)}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-amber-300">
                    SCALE: {scalePercent}%
                  </span>
                  <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-sky-300">
                    X: {Math.round(currentX)}px
                  </span>
                </div>
              </div>

              {/* Character / Section Title & Lore */}
              <div className="mb-6">
                <div
                  className="text-xs font-mono uppercase tracking-widest mb-1"
                  style={{ color: figure.accentColor }}
                >
                  {figure.faction} — {figure.rarity}
                </div>
                <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white mb-2">
                  #{numberLabel} — {figure.name}
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {figure.description}
                </p>
              </div>

              {/* Attribute Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
                {figure.stats.map((st) => (
                  <div
                    key={st.label}
                    className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10"
                  >
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5" style={{ color: figure.accentColor }} />
                        {st.label}
                      </span>
                      <span className="font-mono font-bold text-white">{st.value}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.round(st.value * Math.max(0.2, progress))}%`,
                          backgroundColor: figure.accentColor,
                          boxShadow: `0 0 12px ${figure.accentColor}`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Technical Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10">
                  <div className="text-slate-400 flex items-center gap-1 mb-1">
                    <Compass className="w-3.5 h-3.5 text-emerald-400" /> Height
                  </div>
                  <div className="font-semibold text-white">{figure.specs.height}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10">
                  <div className="text-slate-400 flex items-center gap-1 mb-1">
                    <Shield className="w-3.5 h-3.5 text-amber-400" /> Mass
                  </div>
                  <div className="font-semibold text-white">{figure.specs.weight}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 col-span-2">
                  <div className="text-slate-400 flex items-center gap-1 mb-1">
                    <Cpu className="w-3.5 h-3.5 text-sky-400" /> Energy Core
                  </div>
                  <div className="font-semibold text-white">{figure.specs.core}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
