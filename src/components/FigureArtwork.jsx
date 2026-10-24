import React from 'react';

export default function FigureArtwork({ id, accentColor, secondaryColor, isHovered }) {
  const glowFilter = `drop-shadow(0 22px 26px rgba(0,0,0,0.85)) drop-shadow(0 0 ${
    isHovered ? '28px' : '12px'
  } ${accentColor})`;

  switch (id) {
    case 'sentinel':
      return (
        <svg
          viewBox="0 0 360 440"
          className="w-full h-full select-none"
          style={{ filter: glowFilter }}
        >
          <defs>
            <linearGradient id="sentArmor" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>
            <linearGradient id="sentGold" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
          </defs>

          {/* Floating Energy Wings / Sylvan Blades */}
          <path
            d="M65 110 L20 65 L40 165 L85 190 Z"
            fill="url(#sentArmor)"
            opacity="0.85"
          />
          <path
            d="M295 110 L340 65 L320 165 L275 190 Z"
            fill="url(#sentArmor)"
            opacity="0.85"
          />
          <path
            d="M55 180 L15 155 L35 245 L90 250 Z"
            fill="#10b981"
            opacity="0.65"
          />
          <path
            d="M305 180 L345 155 L325 245 L270 250 Z"
            fill="#10b981"
            opacity="0.65"
          />

          {/* Halo Crest */}
          <polygon
            points="180,22 202,65 180,52 158,65"
            fill="url(#sentGold)"
          />
          <circle cx="180" cy="58" r="8" fill="#a7f3d0" />

          {/* Helmet & Visor */}
          <polygon
            points="145,82 180,62 215,82 208,132 180,148 152,132"
            fill="url(#sentArmor)"
            stroke="#6ee7b7"
            strokeWidth="2"
          />
          <polygon
            points="158,102 180,112 202,102 196,118 180,125 164,118"
            fill="#ecfdf5"
          />

          {/* Massive Pauldrons (Shoulders) */}
          <polygon
            points="82,135 145,125 135,195 70,180"
            fill="url(#sentArmor)"
            stroke="#34d399"
            strokeWidth="2"
          />
          <polygon
            points="278,135 215,125 225,195 290,180"
            fill="url(#sentArmor)"
            stroke="#34d399"
            strokeWidth="2"
          />

          {/* Torso & Quantum Core */}
          <polygon
            points="132,142 228,142 212,258 180,278 148,258"
            fill="#064e3b"
            stroke="#10b981"
            strokeWidth="2.5"
          />
          <polygon
            points="180,165 204,195 180,225 156,195"
            fill="#6ee7b7"
          />
          <circle cx="180" cy="195" r="12" fill="#ffffff" />

          {/* Hexagonal Energy Shield (Left Arm) */}
          <polygon
            points="65,195 105,172 135,205 135,260 105,290 65,265"
            fill="rgba(16, 185, 129, 0.28)"
            stroke="#6ee7b7"
            strokeWidth="3"
          />
          <polygon
            points="82,210 105,195 120,215 120,248 105,265 82,248"
            fill="rgba(167, 243, 208, 0.45)"
          />

          {/* Sylvan Lance / Glaive (Right Arm) */}
          <line
            x1="285"
            y1="55"
            x2="245"
            y2="395"
            stroke="#fde047"
            strokeWidth="5"
          />
          <polygon
            points="285,35 312,95 282,88 265,102"
            fill="#6ee7b7"
            stroke="#ffffff"
            strokeWidth="1.5"
          />

          {/* Armored Greaves / Legs */}
          <polygon
            points="146,268 175,278 165,388 135,405 132,335"
            fill="url(#sentArmor)"
            stroke="#34d399"
            strokeWidth="2"
          />
          <polygon
            points="214,268 185,278 195,388 225,405 228,335"
            fill="url(#sentArmor)"
            stroke="#34d399"
            strokeWidth="2"
          />
        </svg>
      );

    case 'phoenix':
      return (
        <svg
          viewBox="0 0 360 440"
          className="w-full h-full select-none"
          style={{ filter: glowFilter }}
        >
          <defs>
            <linearGradient id="phxWing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="45%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#be123c" />
            </linearGradient>
            <linearGradient id="phxArmor" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#7c2d12" />
            </linearGradient>
          </defs>

          {/* Grand Solar Wings */}
          <path
            d="M145,165 Q65,70 12,95 Q45,155 25,185 Q75,185 40,235 Q105,220 145,230 Z"
            fill="url(#phxWing)"
            stroke="#fde047"
            strokeWidth="2"
          />
          <path
            d="M215,165 Q295,70 348,95 Q315,155 335,185 Q285,185 320,235 Q255,220 215,230 Z"
            fill="url(#phxWing)"
            stroke="#fde047"
            strokeWidth="2"
          />

          {/* Solar Halo */}
          <circle
            cx="180"
            cy="88"
            r="42"
            fill="none"
            stroke="#fde047"
            strokeWidth="3"
            strokeDasharray="10 6"
          />

          {/* Crown & Valkyrie Helm */}
          <polygon
            points="180,32 198,72 222,52 208,95 152,95 138,52 162,72"
            fill="#fef08a"
          />
          <polygon
            points="156,85 180,72 204,85 198,132 180,145 162,132"
            fill="url(#phxArmor)"
            stroke="#fde047"
            strokeWidth="2"
          />
          <polygon points="165,105 180,114 195,105 180,120" fill="#ffffff" />

          {/* Valkyrie Chestplate & Solar Core */}
          <polygon
            points="138,145 222,145 204,252 180,275 156,252"
            fill="url(#phxArmor)"
            stroke="#fbbf24"
            strokeWidth="2.5"
          />
          <circle cx="180" cy="190" r="18" fill="#fef08a" />
          <circle cx="180" cy="190" r="9" fill="#ffffff" />

          {/* Dual Sunblades */}
          <polygon
            points="58,285 95,215 112,232 72,325"
            fill="url(#phxWing)"
            stroke="#fef08a"
            strokeWidth="2"
          />
          <polygon
            points="302,285 265,215 248,232 288,325"
            fill="url(#phxWing)"
            stroke="#fef08a"
            strokeWidth="2"
          />

          {/* Waist Plumes & Greaves */}
          <polygon
            points="145,255 112,355 155,315"
            fill="url(#phxWing)"
            opacity="0.9"
          />
          <polygon
            points="215,255 248,355 205,315"
            fill="url(#phxWing)"
            opacity="0.9"
          />
          <polygon
            points="154,268 176,276 168,398 144,412"
            fill="url(#phxArmor)"
            stroke="#fbbf24"
            strokeWidth="2"
          />
          <polygon
            points="206,268 184,276 192,398 216,412"
            fill="url(#phxArmor)"
            stroke="#fbbf24"
            strokeWidth="2"
          />
        </svg>
      );

    case 'chronos':
      return (
        <svg
          viewBox="0 0 360 440"
          className="w-full h-full select-none"
          style={{ filter: glowFilter }}
        >
          <defs>
            <linearGradient id="chrBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
          </defs>

          {/* Astrolabe Celestial Rings behind character */}
          <ellipse
            cx="180"
            cy="195"
            rx="135"
            ry="46"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            transform="rotate(-25 180 195)"
          />
          <ellipse
            cx="180"
            cy="195"
            rx="135"
            ry="46"
            fill="none"
            stroke="#818cf8"
            strokeWidth="2.5"
            transform="rotate(25 180 195)"
          />

          {/* Floating Chrono Shards */}
          <polygon points="55,95 72,70 84,102 65,120" fill="#7dd3fc" />
          <polygon points="305,95 288,70 276,102 295,120" fill="#818cf8" />
          <polygon points="48,275 68,255 75,290 55,305" fill="#38bdf8" />
          <polygon points="312,275 292,255 285,290 305,305" fill="#818cf8" />

          {/* Hooded Astral Helm */}
          <path
            d="M142,125 Q180,42 218,125 L202,148 L180,158 L158,148 Z"
            fill="url(#chrBody)"
            stroke="#bae6fd"
            strokeWidth="2"
          />
          <circle cx="180" cy="112" r="14" fill="#e0f2fe" />

          {/* Robed Cyber-Torso & Singularity Core */}
          <polygon
            points="126,148 234,148 212,265 180,295 148,265"
            fill="url(#chrBody)"
            stroke="#38bdf8"
            strokeWidth="2"
          />
          <polygon
            points="180,168 208,196 180,224 152,196"
            fill="none"
            stroke="#e0f2fe"
            strokeWidth="3"
          />
          <circle cx="180" cy="196" r="11" fill="#ffffff" />

          {/* Floating Lower Astral Mantle */}
          <polygon
            points="142,270 218,270 242,385 180,415 118,385"
            fill="url(#chrBody)"
            opacity="0.9"
            stroke="#7dd3fc"
            strokeWidth="2"
          />
          <polygon
            points="165,295 195,295 180,395"
            fill="#e0f2fe"
            opacity="0.85"
          />
        </svg>
      );

    case 'raijin':
      return (
        <svg
          viewBox="0 0 360 440"
          className="w-full h-full select-none"
          style={{ filter: glowFilter }}
        >
          <defs>
            <linearGradient id="raiArmor" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="50%" stopColor="#6b21a8" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>

          {/* Thunder Drum Chakra Ring */}
          <circle
            cx="180"
            cy="155"
            r="98"
            fill="none"
            stroke="#a855f7"
            strokeWidth="2.5"
            strokeDasharray="18 14"
          />
          {[0, 60, 120, 180, 240, 300].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const cx = 180 + Math.cos(rad) * 98;
            const cy = 155 + Math.sin(rad) * 98;
            return (
              <circle
                key={deg}
                cx={cx}
                cy={cy}
                r="11"
                fill="#22d3ee"
                stroke="#f0abfc"
                strokeWidth="2"
              />
            );
          })}

          {/* Crossed Dual Electro-Katanas */}
          <line
            x1="45"
            y1="65"
            x2="315"
            y2="345"
            stroke="#22d3ee"
            strokeWidth="5"
          />
          <line
            x1="315"
            y1="65"
            x2="45"
            y2="345"
            stroke="#e879f9"
            strokeWidth="5"
          />

          {/* Cyber Ronin Kasa Hat & Mask */}
          <polygon
            points="105,92 180,55 255,92 225,102 135,102"
            fill="#1e1b4b"
            stroke="#22d3ee"
            strokeWidth="2.5"
          />
          <polygon
            points="154,96 206,96 198,142 180,152 162,142"
            fill="url(#raiArmor)"
            stroke="#c084fc"
            strokeWidth="2"
          />
          <line
            x1="162"
            y1="115"
            x2="198"
            y2="115"
            stroke="#22d3ee"
            strokeWidth="4"
          />

          {/* Samurai Shoulder Guards & Chest */}
          <polygon
            points="92,145 148,138 138,202 82,192"
            fill="url(#raiArmor)"
            stroke="#a855f7"
            strokeWidth="2"
          />
          <polygon
            points="268,145 212,138 222,202 278,192"
            fill="url(#raiArmor)"
            stroke="#a855f7"
            strokeWidth="2"
          />
          <polygon
            points="138,142 222,142 206,258 180,275 154,258"
            fill="url(#raiArmor)"
            stroke="#e879f9"
            strokeWidth="2"
          />
          <polygon
            points="180,168 195,192 182,195 192,222 165,194 178,190"
            fill="#22d3ee"
          />

          {/* Armored Hakama & Greaves */}
          <polygon
            points="142,265 176,272 164,398 130,410"
            fill="url(#raiArmor)"
            stroke="#c084fc"
            strokeWidth="2"
          />
          <polygon
            points="218,265 184,272 196,398 230,410"
            fill="url(#raiArmor)"
            stroke="#c084fc"
            strokeWidth="2"
          />
        </svg>
      );

    case 'sylphira':
      return (
        <svg
          viewBox="0 0 360 440"
          className="w-full h-full select-none"
          style={{ filter: glowFilter }}
        >
          <defs>
            <linearGradient id="sylFlora" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d9f99d" />
              <stop offset="50%" stopColor="#65a30d" />
              <stop offset="100%" stopColor="#065f46" />
            </linearGradient>
          </defs>

          {/* Bioluminescent Fairy/Sylph Wings */}
          <path
            d="M155,165 C65,65 15,125 55,205 C25,245 75,315 155,245 Z"
            fill="rgba(163, 230, 53, 0.35)"
            stroke="#bef264"
            strokeWidth="2.5"
          />
          <path
            d="M205,165 C295,65 345,125 305,205 C335,245 285,315 205,245 Z"
            fill="rgba(163, 230, 53, 0.35)"
            stroke="#bef264"
            strokeWidth="2.5"
          />

          {/* Antler Crown of Yggdrasil */}
          <path
            d="M160,85 Q125,45 105,25 M135,55 L115,62 M200,85 Q235,45 255,25 M225,55 L245,62"
            stroke="#ecfccb"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />

          {/* Head & Oracle Crown */}
          <circle
            cx="180"
            cy="108"
            r="24"
            fill="url(#sylFlora)"
            stroke="#d9f99d"
            strokeWidth="2"
          />
          <circle cx="180" cy="105" r="7" fill="#ffffff" />

          {/* Living Vine Staff */}
          <path
            d="M275,65 Q295,180 265,395"
            stroke="#bef264"
            strokeWidth="5"
            fill="none"
          />
          <circle cx="275" cy="65" r="14" fill="#ecfccb" />

          {/* Graceful Gown & Emerald Heart */}
          <polygon
            points="146,142 214,142 198,242 180,258 162,242"
            fill="url(#sylFlora)"
            stroke="#bef264"
            strokeWidth="2"
          />
          <circle cx="180" cy="188" r="12" fill="#ecfccb" />
          <path
            d="M152,245 L208,245 L245,398 L180,415 L115,398 Z"
            fill="url(#sylFlora)"
            stroke="#a3e635"
            strokeWidth="2"
          />
        </svg>
      );

    case 'vortigon':
    default:
      return (
        <svg
          viewBox="0 0 360 440"
          className="w-full h-full select-none"
          style={{ filter: glowFilter }}
        >
          <defs>
            <linearGradient id="vorTitan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="45%" stopColor="#9f1239" />
              <stop offset="100%" stopColor="#1c1917" />
            </linearGradient>
          </defs>

          {/* Back Magma Pylons */}
          <polygon
            points="75,65 115,45 135,135 85,145"
            fill="url(#vorTitan)"
            stroke="#fda4af"
            strokeWidth="2"
          />
          <polygon
            points="285,65 245,45 225,135 275,145"
            fill="url(#vorTitan)"
            stroke="#fda4af"
            strokeWidth="2"
          />

          {/* Colossal Shoulder Monoliths */}
          <polygon
            points="35,125 128,112 122,222 42,205"
            fill="url(#vorTitan)"
            stroke="#f43f5e"
            strokeWidth="2.5"
          />
          <polygon
            points="325,125 232,112 238,222 318,205"
            fill="url(#vorTitan)"
            stroke="#f43f5e"
            strokeWidth="2.5"
          />

          {/* Titan Head */}
          <polygon
            points="148,78 180,62 212,78 208,132 152,132"
            fill="#1c1917"
            stroke="#fb7185"
            strokeWidth="2.5"
          />
          <polygon points="158,102 202,102 192,114 168,114" fill="#fecdd3" />

          {/* Heavy Basalt Chest & Geothermal Core */}
          <polygon
            points="115,132 245,132 226,272 180,295 134,272"
            fill="url(#vorTitan)"
            stroke="#fb7185"
            strokeWidth="2.5"
          />
          <polygon
            points="180,158 214,198 180,238 146,198"
            fill="#fecdd3"
          />
          <circle cx="180" cy="198" r="14" fill="#ffffff" />

          {/* Pillar Legs */}
          <polygon
            points="126,278 174,288 168,408 118,415"
            fill="url(#vorTitan)"
            stroke="#f43f5e"
            strokeWidth="2.5"
          />
          <polygon
            points="234,278 186,288 192,408 242,415"
            fill="url(#vorTitan)"
            stroke="#f43f5e"
            strokeWidth="2.5"
          />
        </svg>
      );
  }
}
