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

import logoPng from "../assets/logo.png";

const Logo = ({ size = 36 }) => (
  <img src={logoPng} alt="Fit-In Logo" style={{ width: size, height: size, objectFit: 'contain' }} className="drop-shadow-md" />
);

export default Logo;
