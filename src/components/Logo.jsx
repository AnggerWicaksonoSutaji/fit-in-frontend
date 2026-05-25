/**
 * Logo.jsx
 * ─────────────────────────────────────────────────
 * Komponen Logo SVG untuk aplikasi FIT-IN.
 *
 * Logo terdiri dari 3 elemen utama:
 *   1. Sayap kiri (merah) — melambangkan kekuatan & semangat
 *   2. Sayap kanan (biru) — melambangkan ketenangan & konsistensi
 *   3. Badan tengah (gradasi merah→ungu→biru) — melambangkan keseimbangan
 *   4. Lingkaran (mata elang) — melambangkan fokus & presisi
 *
 * Props:
 *   - size (number): Ukuran logo dalam pixel. Default: 36
 * ─────────────────────────────────────────────────
 */

const Logo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
    {/* Sayap kiri — gradasi merah */}
    <path
      d="M15 85 Q35 50 100 45 L85 110 Q50 105 15 85Z"
      fill="url(#rG)"
      opacity="0.9"
    />

    {/* Sayap kanan — gradasi biru */}
    <path
      d="M185 85 Q165 50 100 45 L115 110 Q150 105 185 85Z"
      fill="url(#bG)"
      opacity="0.9"
    />

    {/* Badan tengah — gradasi merah ke biru */}
    <path
      d="M85 110 Q100 170 100 170 Q100 170 115 110 L100 45Z"
      fill="url(#cG)"
    />

    {/* Lingkaran luar (mata elang) */}
    <ellipse cx="100" cy="82" rx="18" ry="14" fill="url(#eG)" />

    {/* Lingkaran dalam (pupil) */}
    <ellipse cx="100" cy="82" rx="9" ry="7" fill="#1a0a0a" />

    {/* Definisi gradasi warna */}
    <defs>
      {/* Gradasi merah untuk sayap kiri */}
      <linearGradient id="rG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ff2020" />
        <stop offset="100%" stopColor="#c0001a" />
      </linearGradient>

      {/* Gradasi biru untuk sayap kanan */}
      <linearGradient id="bG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1a6ebd" />
        <stop offset="100%" stopColor="#0a3a7a" />
      </linearGradient>

      {/* Gradasi merah-ungu-biru untuk badan */}
      <linearGradient id="cG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e03030" />
        <stop offset="50%" stopColor="#8b1a8b" />
        <stop offset="100%" stopColor="#1a6ebd" />
      </linearGradient>

      {/* Gradasi radial untuk lingkaran mata */}
      <radialGradient id="eG" cx="50%" cy="40%">
        <stop offset="0%" stopColor="#ff5555" />
        <stop offset="100%" stopColor="#cc0000" />
      </radialGradient>
    </defs>
  </svg>
);

export default Logo;
