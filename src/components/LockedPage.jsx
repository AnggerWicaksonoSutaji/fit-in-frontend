/**
 * LockedPage.jsx
 * ─────────────────────────────────────────────────
 * Komponen placeholder yang ditampilkan ketika pengguna
 * non-premium mencoba mengakses fitur yang terkunci.
 *
 * Menampilkan:
 *   - Emoji besar sebagai ilustrasi
 *   - Judul fitur yang terkunci
 *   - Pesan penjelasan
 *   - Tombol ajakan upgrade ke premium
 *
 * Props:
 *   - title (string) : Nama fitur yang terkunci
 *   - emoji (string) : Emoji representasi fitur tersebut
 * ─────────────────────────────────────────────────
 */

const LockedPage = ({ title, emoji }) => (
  <div className="flex flex-col items-center justify-center h-96 text-center">
    {/* Emoji ilustrasi fitur */}
    <div className="text-6xl mb-4">{emoji}</div>

    {/* Judul fitur */}
    <h2 className="text-white text-2xl font-black mb-2">{title}</h2>

    {/* Pesan penjelasan */}
    <p className="text-gray-500 text-sm mb-6 max-w-sm">
      Fitur ini tersedia untuk pengguna Premium. Upgrade sekarang untuk akses penuh!
    </p>

    {/* Tombol upgrade */}
    <button
      className="px-8 py-3 rounded-xl font-bold text-white transition-all hover:brightness-110"
      style={{ background: "linear-gradient(135deg,#e03030,#a00020)" }}
    >
      ⭐ Upgrade ke Premium
    </button>
  </div>
);

export default LockedPage;
