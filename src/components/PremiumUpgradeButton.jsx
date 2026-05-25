/**
 * PremiumUpgradeButton.jsx
 * ─────────────────────────────────────────────────
 * Tombol reusable untuk mengarahkan pengguna ke halaman
 * pembayaran / upgrade premium.
 *
 * Digunakan di halaman-halaman yang memiliki konten premium
 * seperti Nutrition, Progress, Schedule, dll.
 *
 * Props:
 *   - onNavigate (function) : Fungsi navigasi dari parent. Akan dipanggil dengan argumen 'payment'
 *   - text (string)         : Teks yang ditampilkan di tombol. Default: "Upgrade Sekarang"
 *   - size (string)         : Ukuran tombol — 'sm' | 'md' | 'lg'. Default: 'md'
 *   - className (string)    : Class tambahan jika diperlukan. Default: ""
 * ─────────────────────────────────────────────────
 */

const PremiumUpgradeButton = ({
  onNavigate,
  text = "Upgrade Sekarang",
  size = "md",
  className = "",
}) => {
  // Mapping ukuran ke class padding & ukuran teks
  const sizeMap = {
    sm: "py-1 text-xs",
    md: "py-1.5 text-xs",
    lg: "py-2 text-sm",
  };

  // Ambil class sesuai ukuran yang dipilih, fallback ke 'md'
  const sizeClasses = sizeMap[size] || sizeMap.md;

  // Gabungkan semua class menjadi satu string
  const classes = `w-full ${sizeClasses} rounded-lg font-bold text-white transition-all hover:brightness-110 ${className}`;

  return (
    <button
      onClick={() => onNavigate("payment")} // Arahkan ke halaman pembayaran
      className={classes}
      style={{ background: "linear-gradient(135deg,#e03030,#a00020)" }}
    >
      {text}
    </button>
  );
};

export default PremiumUpgradeButton;
