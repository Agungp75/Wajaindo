import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Sparkles,
  Layers,
  MousePointerClick,
  Disc,
  ChevronDown,
  Box,
} from 'lucide-react';
import { FIGURES_DATA } from './data/figuresData';
import Background3D from './components/Background3D';
import FigureSection from './components/FigureSection';
import GlbModelViewer from './components/GlbModelViewer';

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
const lerp = (start, end, amt) => start + (end - start) * amt;
const smoothstep = (edge0, edge1, x) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
};

export default function App() {
  const introSectionRef = useRef(null);
  const sectionRefs = useRef({});
  const slotRefs = useRef({});

  // Persistent Traveling 3D Kopdes DOM & 3D World Pose Refs
  const kopdesStageRef = useRef(null);
  const scrollPoseRef = useRef({
    worldX: 0,
    worldY: -1.4,
    worldZ: -2.8,
    modelScale: 1.0,
    opacity: 0,
    rotX: 0.06,
    rotY: 0,
    rotZ: 0,
    damping: 0.05,
  });

  const isKopdesHoveredRef = useRef(false);
  const kopdesTiltRef = useRef({ rotateX: 0, rotateY: 0 });
  const focusedFigureRef = useRef(FIGURES_DATA[0]);
  const scrollVelocityRef = useRef(0);

  const currentProgressRef = useRef(
    FIGURES_DATA.reduce((acc, fig) => ({ ...acc, [fig.id]: 0 }), {})
  );

  const [progressMap, setProgressMap] = useState(() =>
    FIGURES_DATA.reduce((acc, fig) => ({ ...acc, [fig.id]: 0 }), {})
  );
  const [scrollDirection, setScrollDirection] = useState('IDLE');
  const [focusedFigure, setFocusedFigure] = useState(FIGURES_DATA[0]);
  const [introStageLabel, setIntroStageLabel] = useState('FULL VIEW KOPDES');

  // Subtle 3D tilt when moving mouse across window
  useEffect(() => {
    const handleWindowMouseMove = (e) => {
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      const normX = clamp((e.clientX - vw / 2) / (vw / 2), -1, 1);
      const normY = clamp((e.clientY - vh / 2) / (vh / 2), -1, 1);

      isKopdesHoveredRef.current = true;
      kopdesTiltRef.current = {
        rotateY: normX * 12,
        rotateX: -normY * 10,
      };
    };

    window.addEventListener('mousemove', handleWindowMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, []);

  // 60 FPS Reversible Scroll & Cinematic 3D Kopdes Camera/Object Choreography Engine
  useEffect(() => {
    let rafId;
    let lastScrollY = window.scrollY;
    let dirTimeout = null;
    let currentDir = 'IDLE';
    let lastStageText = '';

    const updateScrollEngine = () => {
      const vh = window.innerHeight || 1;
      const vw = window.innerWidth || 1;
      const aspect = vw / vh;
      const viewportCenterY = vh / 2;

      const scrollY = window.scrollY;
      const deltaY = scrollY - lastScrollY;
      scrollVelocityRef.current = clamp(deltaY, -60, 60);

      if (Math.abs(deltaY) > 1.5) {
        const nextDir = deltaY > 0 ? 'DOWN' : 'UP';
        if (nextDir !== currentDir) {
          currentDir = nextDir;
          setScrollDirection(nextDir);
        }
        if (dirTimeout) clearTimeout(dirTimeout);
        dirTimeout = setTimeout(() => {
          currentDir = 'IDLE';
          setScrollDirection('IDLE');
        }, 350);
      }
      lastScrollY = scrollY;

      // 1. Compute individual section progress (for Cards #01 - #06)
      let highestProgress = -1;
      let mostVisibleFigure = FIGURES_DATA[0];
      let hasChanged = false;
      const nextMap = {};

      FIGURES_DATA.forEach((fig) => {
        const el = sectionRefs.current[fig.id];
        if (!el) {
          nextMap[fig.id] = 0;
          return;
        }

        const rect = el.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(elementCenter - viewportCenterY);
        const maxTriggerDistance = vh * 0.72;

        const rawCloseness = 1.0 - distance / maxTriggerDistance;
        const targetProgress = smoothstep(0.0, 1.0, rawCloseness);

        const prevProgress = currentProgressRef.current[fig.id] ?? 0;
        const interpolated = lerp(prevProgress, targetProgress, 0.12);
        const finalProgress =
          interpolated < 0.002 ? 0 : interpolated > 0.998 ? 1 : interpolated;

        currentProgressRef.current[fig.id] = finalProgress;
        nextMap[fig.id] = finalProgress;

        if (Math.abs(finalProgress - prevProgress) > 0.004) {
          hasChanged = true;
        }

        if (finalProgress > highestProgress) {
          highestProgress = finalProgress;
          mostVisibleFigure = fig;
        }
      });

      focusedFigureRef.current = mostVisibleFigure;

      if (hasChanged) {
        setProgressMap({ ...nextMap });
        setFocusedFigure((prev) =>
          prev?.id === mostVisibleFigure.id ? prev : mostVisibleFigure
        );
      }

      // 2. Calculate 3D World Pose for the Kopdes Building
      let targetPose = {
        worldX: 0,
        worldY: 0.02,
        worldZ: 0.15,
        modelScale: 1.0,
        opacity: 1.0,
        rotX: 0.06,
        rotY: 0,
        rotZ: 0,
        damping: 0.045, // Lambat & mulus saat di intro pertama
      };

      const introEl = introSectionRef.current;
      if (introEl) {
        const introRect = introEl.getBoundingClientRect();
        // Kopdes tetap 100% tersembunyi (opacity: 0, di bawah layar) saat berada di atas (Hero Section).
        // Baru mulai muncul saat user sudah men-scroll ke bawah (introRect.top naik melewati 88% tinggi layar)
        // dan mencapai posisi penuh saat introRect.top mencapai 35% tinggi layar.
        const revealStartTop = vh * 0.88;
        const fullAppearTop = vh * 0.35;
        const introScrollableSpan = Math.max(1, introRect.height - vh * 0.65);

        if (introRect.top > fullAppearTop) {
          // ====================================================================
          // AREA A: Di Hero Section / Baru mulai di-scroll sedikit ke bawah
          // Sebelum di-scroll (introRect.top >= revealStartTop): opacity = 0 (tidak terlihat sama sekali)
          // Saat di-scroll ke bawah: muncul perlahan dari bawah menuju tengah
          // ====================================================================
          const rawReveal =
            (revealStartTop - introRect.top) / Math.max(1, revealStartTop - fullAppearTop);
          const p = smoothstep(0.0, 1.0, clamp(rawReveal, 0.0, 1.0));

          targetPose.worldX = 0;
          targetPose.worldY = 0.02 - (1.0 - p) * 2.2; // Muncul naik dari bawah
          targetPose.worldZ = -2.6 + p * 2.75; // Membesar dari -2.6 ke 0.15
          targetPose.opacity = p <= 0.01 ? 0.0 : clamp(p * 1.15, 0.0, 1.0);
          targetPose.rotX = 0.06;
          targetPose.rotY = 0;
          targetPose.rotZ = 0;

          const stageTxt = p <= 0.02 ? 'HERO (SCROLL KE BAWAH)' : 'REVEAL KOPDES 3D';
          if (lastStageText !== stageTxt) {
            lastStageText = stageTxt;
            setIntroStageLabel(stageTxt);
          }
        } else {
          // Normalized progress inside the long #kopdes-intro section (0.0 -> 1.0)
          const scrolledInsideIntro = fullAppearTop - introRect.top;
          const introP = clamp(scrolledInsideIntro / introScrollableSpan, 0.0, 1.0);
          const introEndTop = fullAppearTop - introScrollableSpan;
          const introEndCenterY = viewportCenterY + (introRect.top - introEndTop);

          if (introRect.top >= introEndTop) {
            // ====================================================================
            // AREA B: Di dalam #kopdes-intro (Durasi Panjang & Lambat untuk Backsound)
            // 4 Tahap Sinematik sesuai instruksi:
            // 1. (0.00 - 0.16): Muncul Kopdes utuh di tengah
            // 2. (0.16 - 0.42): Membesar (Zoom In) & mengarah ke pintu sebelah kiri paling ujung
            // 3. (0.42 - 0.78): Kopdes bergerak ke kiri hingga semua pintu depan diperlihatkan
            // 4. (0.78 - 1.00): Zoom Out kembali ke ukuran semula (tampilan keseluruhan Kopdes)
            // ====================================================================
            targetPose.opacity = 1.0;

            if (introP <= 0.16) {
              // Tahap 1: Tampilan utuh Kopdes di tengah
              targetPose.worldX = 0;
              targetPose.worldY = 0.02;
              targetPose.worldZ = 0.15;
              targetPose.rotX = 0.06;
              targetPose.rotY = 0;
              targetPose.rotZ = 0;

              if (lastStageText !== '1/4: TAMPILAN UTUH KOPDES') {
                lastStageText = '1/4: TAMPILAN UTUH KOPDES';
                setIntroStageLabel(lastStageText);
              }
            } else if (introP <= 0.42) {
              // Tahap 2: Membesar (Zoom proporsional sesuai Gambar 2) & mengarah ke sisi pintu kiri
              const tZoom = smoothstep(0.16, 0.42, introP);
              targetPose.worldX = lerp(0, 0.72, tZoom);
              targetPose.worldY = lerp(0.02, 0.2, tZoom); // Sedikit naik agar lantai bawah & pintu terlihat utuh
              targetPose.worldZ = lerp(0.15, 1.95, tZoom); // Zoom proporsional sesuai Gambar 2
              targetPose.rotX = lerp(0.06, 0.03, tZoom);
              targetPose.rotY = 0;
              targetPose.rotZ = 0;

              if (lastStageText !== '2/4: ZOOM PINTU KIRI UJUNG') {
                lastStageText = '2/4: ZOOM PINTU KIRI UJUNG';
                setIntroStageLabel(lastStageText);
              }
            } else if (introP <= 0.78) {
              // Tahap 3: Bangunan Kopdes bergerak perlahan ke kiri hingga semua bagian depan diperlihatkan
              const tPan = smoothstep(0.42, 0.78, introP);
              targetPose.worldX = lerp(0.72, -0.78, tPan);
              targetPose.worldY = 0.2;
              targetPose.worldZ = 1.95;
              targetPose.rotX = 0.03;
              targetPose.rotY = 0;
              targetPose.rotZ = 0;

              if (lastStageText !== '3/4: PAN SEMUA PINTU DEPAN') {
                lastStageText = '3/4: PAN SEMUA PINTU DEPAN';
                setIntroStageLabel(lastStageText);
              }
            } else {
              // Tahap 4: Zoom Out kembali ke ukuran semula (memperlihatkan keseluruhan Kopdes di tengah)
              const tOut = smoothstep(0.78, 1.0, introP);
              targetPose.worldX = lerp(-0.78, 0, tOut);
              targetPose.worldY = lerp(0.2, 0.02, tOut);
              targetPose.worldZ = lerp(1.95, 0.15, tOut);
              targetPose.rotX = lerp(0.03, 0.06, tOut);
              targetPose.rotY = 0;
              targetPose.rotZ = 0;

              if (lastStageText !== '4/4: ZOOM OUT FULL KOPDES') {
                lastStageText = '4/4: ZOOM OUT FULL KOPDES';
                setIntroStageLabel(lastStageText);
              }
            }
          } else {
            // ====================================================================
            // AREA C: Setelah Zoom Out selesai -> Masuk ke Card #01 s/d #06
            // Posisi digeser lebih ke pinggir (sesuai kotak merah X kuning)
            // dan ukuran sedikit diperbesar (+ ~1cm lebar di layar -> modelScale: 0.62)
            // ====================================================================
            const sideOffsetWorldX = vw >= 1024 ? clamp(aspect * 1.17, 1.65, 2.22) : aspect * 0.52;
            const cardWorldZ = vw >= 1024 ? -0.65 : -1.1;
            const cardModelScale = vw >= 1024 ? 0.62 : 0.52;

            const waypoints = [
              {
                id: 'intro-end',
                centerY: introEndCenterY,
                worldX: 0,
                worldY: 0.02,
                worldZ: 0.15,
                modelScale: 1.0,
                rotY: 0,
                rotZ: 0,
                rotX: 0.06,
              },
            ];

            FIGURES_DATA.forEach((fig) => {
              const secEl = sectionRefs.current[fig.id];
              if (!secEl) return;
              const secRect = secEl.getBoundingClientRect();
              const isLeftSlot = fig.direction === 'left';

              waypoints.push({
                id: fig.id,
                centerY: secRect.top + secRect.height / 2,
                worldX: isLeftSlot ? -sideOffsetWorldX : sideOffsetWorldX,
                worldY: 0.1,
                worldZ: cardWorldZ,
                modelScale: cardModelScale,
                rotY: isLeftSlot ? 0.38 : -0.38,
                rotZ: isLeftSlot ? 0.055 : -0.055,
                rotX: 0.08,
              });
            });

            const lastWp = waypoints[waypoints.length - 1];
            targetPose.opacity = 1.0;
            // Saat memasuki area Card (#01 - #06), gunakan respons gerak pindah yang cepat & sigap!
            targetPose.damping = 0.24;

            if (viewportCenterY >= lastWp.centerY) {
              targetPose.worldX = lastWp.worldX;
              targetPose.worldY = lastWp.worldY;
              targetPose.worldZ = lastWp.worldZ;
              targetPose.modelScale = lastWp.modelScale;
              targetPose.rotY = lastWp.rotY;
              targetPose.rotZ = lastWp.rotZ;
              targetPose.rotX = lastWp.rotX;
            } else {
              for (let i = 0; i < waypoints.length - 1; i++) {
                const wpA = waypoints[i];
                const wpB = waypoints[i + 1];

                if (viewportCenterY >= wpA.centerY && viewportCenterY <= wpB.centerY) {
                  const span = Math.max(1, wpB.centerY - wpA.centerY);
                  const rawT = clamp((viewportCenterY - wpA.centerY) / span, 0.0, 1.0);

                  if (i === 0) {
                    // Dari Akhir Intro (Tengah Utuh) -> Masuk ke Card #01:
                    // Percepat kurva transisi (rawT * 1.55) agar Kopdes langsung sigap pindah ke posisi samping sebelum Card #01 sampai di tengah
                    const fastRawT = clamp(rawT * 1.55, 0.0, 1.0);
                    const t = smoothstep(0.0, 1.0, fastRawT);
                    targetPose.worldX = lerp(wpA.worldX, wpB.worldX, t);
                    targetPose.worldY = lerp(wpA.worldY, wpB.worldY, t);
                    targetPose.worldZ = lerp(wpA.worldZ, wpB.worldZ, t);
                    targetPose.modelScale = lerp(wpA.modelScale, wpB.modelScale, t);
                    targetPose.rotY = lerp(wpA.rotY, wpB.rotY, t);
                    targetPose.rotZ = lerp(wpA.rotZ, wpB.rotZ, t);
                    targetPose.rotX = lerp(wpA.rotX, wpB.rotX, t);
                  } else {
                    // Antar Card (#01 -> #02 -> #03 -> dst):
                    // Percepat gerak pindah antar sisi sehingga tepat saat card muncul, Kopdes sudah sampai di posisinya
                    const fastCardT = clamp((rawT - 0.08) / 0.78, 0.0, 1.0);
                    const s = smoothstep(0.0, 1.0, fastCardT);
                    const centerBell = Math.sin(Math.PI * s); // 1.0 saat lewat di tengah menghadap user

                    targetPose.worldX = lerp(wpA.worldX, wpB.worldX, s);
                    targetPose.worldY = 0.1;
                    targetPose.worldZ = lerp(wpA.worldZ, wpB.worldZ, s) + centerBell * 0.25;
                    targetPose.modelScale =
                      lerp(wpA.modelScale, wpB.modelScale, s) + centerBell * 0.1;
                    targetPose.rotY = lerp(wpA.rotY, wpB.rotY, s);
                    targetPose.rotZ = lerp(wpA.rotZ, wpB.rotZ, s);
                    targetPose.rotX = lerp(wpA.rotX, wpB.rotX, s) - centerBell * 0.02;
                  }
                  break;
                }
              }
            }

            const cardStageText = `CARD #0${mostVisibleFigure.index} — ${mostVisibleFigure.name}`;
            if (lastStageText !== cardStageText) {
              lastStageText = cardStageText;
              setIntroStageLabel(cardStageText);
            }
          }
        }
      }

      // Gunakan damping lambat (0.045) saat di Intro Pertama, dan damping cepat (0.24) saat pindah antar Card
      const cur = scrollPoseRef.current;
      const spd = targetPose.damping ?? 0.045;
      cur.damping = spd;
      cur.worldX = lerp(cur.worldX, targetPose.worldX, spd);
      cur.worldY = lerp(cur.worldY, targetPose.worldY, spd);
      cur.worldZ = lerp(cur.worldZ, targetPose.worldZ, spd);
      cur.modelScale = lerp(cur.modelScale, targetPose.modelScale, spd);
      cur.opacity = lerp(cur.opacity, targetPose.opacity, 0.12);
      cur.rotX = lerp(cur.rotX, targetPose.rotX, spd);
      cur.rotY = lerp(cur.rotY, targetPose.rotY, spd);
      cur.rotZ = lerp(cur.rotZ, targetPose.rotZ, spd);

      if (kopdesStageRef.current) {
        kopdesStageRef.current.style.opacity = cur.opacity > 0.99 ? '1' : cur.opacity.toFixed(3);
      }

      rafId = requestAnimationFrame(updateScrollEngine);
    };

    rafId = requestAnimationFrame(updateScrollEngine);
    return () => {
      cancelAnimationFrame(rafId);
      if (dirTimeout) clearTimeout(dirTimeout);
    };
  }, []);

  const activeProgress = progressMap[focusedFigure?.id] ?? 0;
  const activeScalePercent = Math.round((0.55 + activeProgress * 0.45) * 100);

  return (
    <div className="relative min-h-screen text-white selection:bg-emerald-400 selection:text-slate-950">
      {/* Layer 0: User's Forest Background + Three.js 3D Particle System */}
      <Background3D scrollVelocityRef={scrollVelocityRef} />

      {/* =================================================================
          FULL-VIEWPORT PERSISTENT 3D KOPDES STAGE (TANPA CLIPPING / TANPA KEDIP)
      ================================================================= */}
      <div
        ref={kopdesStageRef}
        className="fixed inset-0 z-20 pointer-events-none overflow-hidden"
        style={{
          opacity: 0,
          willChange: 'opacity',
          backfaceVisibility: 'hidden',
        }}
      >
        <GlbModelViewer
          modelUrl="/models/kopdes_nagari_sianok_3d.glb"
          hoverRef={isKopdesHoveredRef}
          tiltRef={kopdesTiltRef}
          scrollPoseRef={scrollPoseRef}
        />
      </div>

      {/* =================================================================
          STICKY TOP HUD & TELEMETRY HEADER
      ================================================================= */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-slate-950/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <a href="#top" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400/85 to-teal-600/85 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition">
              <Layers className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="font-display font-black tracking-wider text-sm sm:text-base text-white drop-shadow-md flex items-center gap-2">
                SYLVAN<span className="text-emerald-400">3D</span>
                <span className="hidden md:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-200 border border-emerald-400/25 backdrop-blur-sm">
                  REACT + THREE.JS
                </span>
              </div>
              <p className="text-[11px] text-slate-100/80 drop-shadow hidden sm:block">
                Interactive 3D Reversible Scroll Showcase
              </p>
            </div>
          </a>

          {/* Real-Time Scroll Direction & Camera Stage Telemetry */}
          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-950/20 border border-white/15 backdrop-blur-md text-xs font-mono">
            <div className="flex items-center gap-2 pr-3 border-r border-white/15">
              {scrollDirection === 'DOWN' && (
                <>
                  <ArrowDownCircle className="w-4 h-4 text-emerald-400 animate-bounce" />
                  <span className="text-emerald-300 font-bold">SCROLL DOWN</span>
                </>
              )}
              {scrollDirection === 'UP' && (
                <>
                  <ArrowUpCircle className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span className="text-amber-300 font-bold">SCROLL UP REVERSE</span>
                </>
              )}
              {scrollDirection === 'IDLE' && (
                <>
                  <Disc className="w-4 h-4 text-sky-400 animate-spin-slow" />
                  <span className="text-slate-200">60FPS READY</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-200">
                STAGE: <strong className="text-emerald-300">{introStageLabel}</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-200 border border-emerald-400/30">
                SCALE: {activeScalePercent}%
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* =================================================================
          HERO SECTION (VERTICAL STORYTELLING INTRO)
      ================================================================= */}
      <main id="top" className="relative z-10 pt-24 sm:pt-32">
        <section className="min-h-[92vh] pb-16 flex flex-col items-center justify-center text-center px-4 sm:px-8 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 text-xs font-mono uppercase tracking-widest mb-6 backdrop-blur-md shadow-lg">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive 3D Figure Showcase • Reversible Scroll Engine
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight leading-none mb-6 drop-shadow-2xl">
            GUARDIANS OF THE{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300">
              ETERNAL CANOPY
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed mb-10 bg-slate-950/60 backdrop-blur-md p-5 rounded-2xl border border-white/15 shadow-xl">
            Gulir ke bawah (<strong className="text-emerald-300">Scroll Down</strong>) untuk
            memunculkan bangunan 3D <strong className="text-white">Kopdes Nagari Sianok</strong>, melakukan
            <em> zoom-in</em> ke pintu paling kiri, bergeser memperlihatkan seluruh pintu depan, lalu
            <em> zoom-out</em> kembali ke tampilan utuh sebelum masuk ke <strong className="text-emerald-300">Card #01</strong>–<strong className="text-amber-300">#06</strong>.
          </p>

          {/* Interactive Feature Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mb-12 text-left">
            <div className="p-4 rounded-2xl bg-slate-950/75 border border-emerald-400/30 backdrop-blur-md">
              <div className="text-xs font-mono uppercase text-emerald-400 mb-1 flex items-center gap-1.5">
                <ArrowDownCircle className="w-4 h-4" /> 01. Cinematic Door Pan
              </div>
              <p className="text-xs text-slate-300">
                Zoom ke pintu kiri ujung → geser tampilkan semua pintu depan → zoom out utuh.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/75 border border-sky-400/30 backdrop-blur-md">
              <div className="text-xs font-mono uppercase text-sky-400 mb-1 flex items-center gap-1.5">
                <MousePointerClick className="w-4 h-4" /> 02. Multi-Layer 3D Tilt
              </div>
              <p className="text-xs text-slate-300">
                Interaksi kursor 3D (`rotasi ±16°`) pada bangunan 3D maupun figur.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/75 border border-amber-400/30 backdrop-blur-md">
              <div className="text-xs font-mono uppercase text-amber-400 mb-1 flex items-center gap-1.5">
                <Box className="w-4 h-4" /> 03. Dynamic 3D GLB Stage
              </div>
              <p className="text-xs text-slate-300">
                Bangunan 3D Kopdes melayang mulus berpindah sisi mengikuti posisi card `#01`–`#06`.
              </p>
            </div>
          </div>

          {/* Quick Jump Character Roster */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
            {FIGURES_DATA.map((fig) => (
              <a
                key={fig.id}
                href={`#figure-${fig.id}`}
                className="px-3.5 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/15 hover:border-emerald-400/50 text-xs font-display font-bold tracking-wider transition flex items-center gap-2 backdrop-blur-md"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: fig.accentColor }}
                />
                #{String(fig.index).padStart(2, '0')} — {fig.name.split(' ')[0]}
              </a>
            ))}
          </div>

          <a
            href="#kopdes-intro"
            className="inline-flex flex-col items-center gap-1 text-xs font-mono uppercase tracking-widest text-emerald-300 hover:text-emerald-200 transition"
          >
            <span>Mulai Eksplorasi Scroll 3D</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </a>
        </section>

        {/* =================================================================
            WAYPOINT 0: SHOWCASE PERTAMA KOPDES 3D (DURASI PANJANG 420VH)
            Tahap 1: Muncul utuh di tengah
            Tahap 2: Zoom in ke pintu kiri paling ujung
            Tahap 3: Geser ke kiri memperlihatkan semua pintu depan
            Tahap 4: Zoom out kembali ke tampilan keseluruhan Kopdes
        ================================================================= */}
        <section
          ref={introSectionRef}
          id="kopdes-intro"
          className="relative min-h-[750vh] pointer-events-none"
        />

        {/* =================================================================
            WAYPOINTS 1..6: ZIG-ZAG CARDS (#01 s/d #06)
        ================================================================= */}
        <div className="space-y-12 sm:space-y-24 pb-28">
          {FIGURES_DATA.map((figure) => (
            <FigureSection
              key={figure.id}
              figure={figure}
              sectionRef={(el) => {
                sectionRefs.current[figure.id] = el;
              }}
              slotRef={(el) => {
                slotRefs.current[figure.id] = el;
              }}
              progress={progressMap[figure.id] ?? 0}
            />
          ))}
        </div>
      </main>

      {/* =================================================================
          FOOTER
      ================================================================= */}
      <footer className="relative z-30 border-t border-white/15 bg-slate-950/85 backdrop-blur-xl py-10 px-4 sm:px-8 text-center">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="font-display font-bold text-white tracking-wider">
            SYLVAN 3D // INTERACTIVE FIGURE SHOWCASE
          </div>
          <div>
            Dibangun dengan React.js, Tailwind CSS & Three.js 3D Engine.
          </div>
          <a
            href="#top"
            className="px-4 py-2 round