export const FIGURES_DATA = [
  {
    id: 'sentinel',
    index: 1,
    name: 'KOPDES NAGARI SIANOK',
    title: '3D Architectural Showcase (.GLB Model)',
    faction: 'Nagari Sianok // Smart Hub',
    rarity: 'FEATURED 3D // GLB-01',
    direction: 'left', // Ganjil: kiri ke kanan (-180px -> 0px)
    standalone3D: true,
    modelUrl: '/models/kopdes_nagari_sianok_3d.glb',
    customImage: '/figur-card.png', // Hanya nomor 01 yang menggunakan gambar ini
    accentColor: '#10b981', // Emerald
    secondaryColor: '#34d399',
    glowRgba: 'rgba(16, 185, 129, 0.45)',
    cardGradient: 'from-emerald-950/85 via-teal-950/75 to-slate-950/90',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    description:
      'Model 3D interaktif Kopdes Nagari Sianok yang dirender secara real-time menggunakan Three.js GLTFLoader. Menampilkan struktur bangunan lengkap meliputi pondasi, kanopi/awning, pintu, atap, tanaman, serta detail interior yang membesar saat di-scroll dan berputar mengikuti arah kursor.',
    stats: [
      { label: 'Struktur & Pondasi 3D', value: 98 },
      { label: 'Detail Eksterior & Atap', value: 95 },
      { label: 'Tata Ruang Interior', value: 92 },
      { label: 'Presisi Geometri GLB', value: 96 },
    ],
    specs: {
      height: 'Real-Time 3D Mesh',
      weight: '682 KB (GLTF 2.0)',
      core: 'KopdesBuildingRoot 3D',
      audioTheme: 'Emerald Sylvan Harp & Sub-Pad (432 Hz)',
    },
    audioPreset: {
      baseFreq: 220, // A3
      chord: [220, 261.63, 329.63, 392.0], // Am7 lush pad
      arpNotes: [440, 523.25, 659.25, 783.99, 659.25, 523.25],
      waveform: 'triangle',
      arpSpeed: 220, // ms per note
      filterFreq: 1400,
    },
  },
  {
    id: 'phoenix',
    index: 2,
    name: 'IGNIS VALKYRIE',
    title: 'Solar Flare Winged Sovereign',
    faction: 'Helios Ascendant',
    rarity: 'LEGENDARY // TIER-01',
    direction: 'right', // Genap: kanan ke kiri (+180px -> 0px)
    accentColor: '#f59e0b', // Amber / Solar Gold
    secondaryColor: '#fb7185',
    glowRgba: 'rgba(245, 158, 11, 0.45)',
    cardGradient: 'from-amber-950/85 via-orange-950/75 to-slate-950/90',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    description:
      'Entitas bersayap plasma yang lahir dari sinar matahari pagi yang menembus pepohonan raksasa. Setiap kepakan sayap fotoniknya melepaskan partikel emas termal yang membelokkan cahaya di sekitarnya.',
    stats: [
      { label: 'Solar Burst Velocity', value: 98 },
      { label: 'Thermal Shielding', value: 87 },
      { label: 'Aerial Precision', value: 95 },
      { label: 'Plasma Ignition', value: 94 },
    ],
    specs: {
      height: '2.10 Meters',
      weight: '185 Kg (Light-Frame)',
      core: 'Helios Corona Reactor',
      audioTheme: 'Golden Harmonic Choir & Warm Arp',
    },
    audioPreset: {
      baseFreq: 293.66, // D4
      chord: [293.66, 369.99, 440.0, 554.37], // Dmaj7 warm solar chord
      arpNotes: [587.33, 739.99, 880.0, 1108.73, 880.0, 739.99],
      waveform: 'sine',
      arpSpeed: 190,
      filterFreq: 1800,
    },
  },
  {
    id: 'chronos',
    index: 3,
    name: 'NYX CHRONOS',
    title: 'Dimensional Astral Weaver',
    faction: 'Aether Continuum',
    rarity: 'MYTHIC // TIER-00',
    direction: 'left', // Ganjil: kiri ke kanan (-180px -> 0px)
    accentColor: '#38bdf8', // Cyan / Sky Blue
    secondaryColor: '#818cf8',
    glowRgba: 'rgba(56, 189, 248, 0.45)',
    cardGradient: 'from-sky-950/85 via-indigo-950/75 to-slate-950/90',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
    description:
      'Arsitek ruang-waktu yang memanipulasi gravitasi dan pantulan langit biru di atas hutan. Cincin astrolabe di sekeliling tubuhnya berputar secara independen untuk mengunci anomali dimensi.',
    stats: [
      { label: 'Temporal Distortion', value: 99 },
      { label: 'Zero-G Equilibrium', value: 93 },
      { label: 'Psionic Projection', value: 91 },
      { label: 'Void Containment', value: 88 },
    ],
    specs: {
      height: '2.28 Meters',
      weight: '0 Kg (Graviton Suspended)',
      core: 'Chrono-Tesseract Orb',
      audioTheme: 'Crystalline Sky Synth & Delay Pulse',
    },
    audioPreset: {
      baseFreq: 246.94, // B3
      chord: [246.94, 311.13, 369.99, 493.88], // Bmaj7 celestial
      arpNotes: [493.88, 622.25, 739.99, 987.77, 1244.5, 739.99],
      waveform: 'triangle',
      arpSpeed: 165,
      filterFreq: 2100,
    },
  },
  {
    id: 'raijin',
    index: 4,
    name: 'KAELEN RAIJIN',
    title: 'Thunderstrike Cyber-Ronin',
    faction: 'Tempest Blade',
    rarity: 'LEGENDARY // TIER-01',
    direction: 'right', // Genap: kanan ke kiri (+180px -> 0px)
    accentColor: '#a855f7', // Purple / Electric Violet
    secondaryColor: '#22d3ee',
    glowRgba: 'rgba(168, 85, 247, 0.45)',
    cardGradient: 'from-purple-950/85 via-fuchsia-950/75 to-slate-950/90',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
    description:
      'Pendekar kilat berkecepatan supersonik yang menebas keheningan menggunakan katana induksi magnetik. Jejak langkahnya meninggalkan busur listrik ungu yang beresonansi dengan medan magnet bumi.',
    stats: [
      { label: 'Iaido Strike Speed', value: 99 },
      { label: 'Volt-Blade Conductivity', value: 95 },
      { label: 'Reflex Neural Sync', value: 97 },
      { label: 'Stealth Camouflage', value: 89 },
    ],
    specs: {
      height: '1.98 Meters',
      weight: '142 Kg (Carbon-Titanium)',
      core: 'Piezo-Thunder Capacitor',
      audioTheme: 'Cyberpunk Bass Drone & Electro Pluck',
    },
    audioPreset: {
      baseFreq: 164.81, // E3
      chord: [164.81, 196.0, 246.94, 293.66], // Em7 dark cyber
      arpNotes: [329.63, 392.0, 493.88, 587.33, 659.25, 493.88],
      waveform: 'sawtooth',
      arpSpeed: 150,
      filterFreq: 1150,
    },
  },
  {
    id: 'sylphira',
    index: 5,
    name: 'SYLPHIRA VERDANT',
    title: 'Bioluminescent Flora Oracle',
    faction: 'Gaia Nexus',
    rarity: 'MYTHIC // TIER-01',
    direction: 'left', // Ganjil: kiri ke kanan (-180px -> 0px)
    accentColor: '#84cc16', // Lime / Bioluminescent Green
    secondaryColor: '#14b8a6',
    glowRgba: 'rgba(132, 204, 22, 0.45)',
    cardGradient: 'from-lime-950/85 via-emerald-950/75 to-slate-950/90',
    badgeBg: 'bg-lime-500/20 text-lime-300 border-lime-400/40',
    description:
      'Sang Oracle yang menghubungkan jaringan miselium bawah tanah dengan spora bercahaya di udara. Kehadirannya memicu pertumbuhan kristal organik yang menyembuhkan ekosistem di sekitarnya.',
    stats: [
      { label: 'Spore Telepathy', value: 96 },
      { label: 'Bio-Regeneration', value: 98 },
      { label: 'Harmonic Aura', value: 94 },
      { label: 'Nature Synthesis', value: 92 },
    ],
    specs: {
      height: '2.05 Meters',
      weight: '118 Kg (Living Flora)',
      core: 'Heart of Yggdrasil Seed',
      audioTheme: 'Enchanted Forest Chimes & Lush Flute Pad',
    },
    audioPreset: {
      baseFreq: 261.63, // C4
      chord: [261.63, 329.63, 392.0, 493.88], // Cmaj7 peaceful forest
      arpNotes: [523.25, 659.25, 783.99, 987.77, 783.99, 659.25],
      waveform: 'sine',
      arpSpeed: 210,
      filterFreq: 1750,
    },
  },
  {
    id: 'vortigon',
    index: 6,
    name: 'VORTIGON REX',
    title: 'Obsidian Monolith Colossus',
    faction: 'Core Walkers',
    rarity: 'LEGENDARY // TIER-00',
    direction: 'right', // Genap: kanan ke kiri (+180px -> 0px)
    accentColor: '#f43f5e', // Rose / Crimson Core
    secondaryColor: '#fb923c',
    glowRgba: 'rgba(244, 63, 94, 0.45)',
    cardGradient: 'from-rose-950/85 via-red-950/75 to-slate-950/90',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
    description:
      'Raksasa pelindung berlapis batuan basal dan kristal magma yang bangkit dari akar terdalam bumi. Kekuatan tektoniknya mampu menahan badai kosmik sekaligus menjaga keseimbangan kerak planet.',
    stats: [
      { label: 'Tectonic Impact', value: 100 },
      { label: 'Magma Core Defense', value: 97 },
      { label: 'Gravity Anchor', value: 95 },
      { label: 'Overdrive Output', value: 93 },
    ],
    specs: {
      height: '3.20 Meters',
      weight: '1,250 Kg (Basalt-Titan)',
      core: 'Geothermal Fusion Heart',
      audioTheme: 'Deep Tectonic Sub-Bass & Metallic Resonance',
    },
    audioPreset: {
      baseFreq: 130.81, // C3 deep sub
      chord: [130.81, 164.81, 196.0, 246.94], // Cmaj7 deep
      arpNotes: [261.63, 329.63, 392.0, 523.25, 392.0, 329.63],
      waveform: 'sawtooth',
      arpSpeed: 240,
      filterFreq: 950,
    },
  },
];
