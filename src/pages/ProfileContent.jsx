/**
 * ProfileContent.jsx
 * ─────────────────────────────────────────────────
 * Halaman "Profile" yang menampilkan informasi akun pengguna.
 *
 * Menampilkan:
 *   - Avatar dengan inisial nama (dengan efek gradient)
 *   - Nama pengguna + badge status (Premium / Free)
 *   - Info rows: Username, Email, Member Sejak, Status Akun
 *   - Banner upgrade premium
 *   - Tombol logout
 *
 * Data diambil dari localStorage dengan key "fitinUser":
 *   - name       : Nama pengguna
 *   - email      : Email pengguna
 *   - created_at : Tanggal registrasi (ISO string)
 *
 * Props:
 *   - onLogout (function) : Callback saat tombol logout diklik
 * ─────────────────────────────────────────────────
 */

/**
 * InfoRow — Komponen lokal untuk menampilkan satu baris informasi profil.
 * Hanya digunakan di dalam ProfileContent, sehingga didefinisikan di sini.
 *
 * Props:
 *   - label (string) : Label/nama field
 *   - value (string) : Nilai field
 *   - icon  (string) : Emoji ikon representasi field
 */
const InfoRow = ({ label, value, icon }) => (
  <div
    className="flex items-center gap-4 p-4 rounded-xl transition-all"
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
    }}
  >
    {/* Icon container */}
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
      style={{ background: "rgba(224,48,48,0.1)" }}
    >
      {icon}
    </div>

    {/* Label dan nilai */}
    <div className="flex-1 min-w-0">
      <p className="text-gray-500 text-xs mb-0.5">{label}</p>
      <p className="text-white font-semibold text-sm truncate">{value || "-"}</p>
    </div>
  </div>
);

const ProfileContent = ({ onLogout, onNavigate }) => {
  // Ambil data pengguna dari localStorage
  const user = JSON.parse(localStorage.getItem("fitinUser") || "{}");

  // Ambil inisial nama untuk avatar (fallback ke "A")
  const initial = (user?.name || "A")[0].toUpperCase();

  // Cek status premium
  const isPremium = localStorage.getItem("fitinPremium") === "true";

  return (
    <div className="max-w-xl mx-auto">
      {/* ── Header Halaman ── */}
      <h2 className="text-white text-2xl font-black mb-2">Profile</h2>
      <p className="text-gray-500 text-sm mb-6">Informasi akun kamu</p>

      {/* ── Avatar dan Nama ── */}
      <div
        className="rounded-2xl p-6 mb-5 flex flex-col items-center text-center"
        style={{
          background: "linear-gradient(135deg, rgba(224,48,48,0.12), rgba(26,110,189,0.12))",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Avatar lingkaran dengan gradasi dan efek glow */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black text-white mb-4"
          style={{
            background: "linear-gradient(135deg, #e03030, #cc44cc, #1a6ebd)",
            boxShadow: "0 0 32px rgba(224,48,48,0.4)",
          }}
        >
          {initial}
        </div>

        {/* Nama pengguna */}
        <h3 className="text-white text-xl font-black mb-1">{user?.name || "Athlete"}</h3>

        {/* Badge status member */}
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-bold"
          style={{
            background: isPremium ? "rgba(251,191,36,0.2)" : "rgba(251,191,36,0.1)",
            color: "#fbbf24",
            border: "1px solid rgba(251,191,36,0.3)",
          }}
        >
          {isPremium ? "⭐ PREMIUM MEMBER" : "FREE MEMBER"}
        </span>
      </div>

      {/* ── Baris Informasi Akun ── */}
      <div className="flex flex-col gap-3 mb-5">
        <InfoRow label="Username" value={user?.name} icon="👤" />
        <InfoRow label="Email" value={user?.email} icon="📧" />
        <InfoRow
          label="Member Sejak"
          value={
            user?.created_at
              // Format tanggal registrasi jika tersedia
              ? new Date(user.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
              // Gunakan tanggal hari ini jika tidak ada data registrasi
              : new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
          }
          icon="📅"
        />
        <InfoRow label="Status Akun" value="Aktif ✓" icon="🛡️" />
      </div>

      {/* ── Banner Upgrade Premium ── */}
      {!isPremium && (
        <div
          className="rounded-2xl p-5 mb-5 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(224,48,48,0.15), rgba(26,110,189,0.15))",
            border: "1px solid rgba(224,48,48,0.25)",
          }}
        >
          <div className="text-3xl mb-2">⭐</div>
          <h4 className="text-white font-bold mb-1">Upgrade ke Premium</h4>
          <p className="text-gray-500 text-xs mb-4">
            Unlock semua fitur: Progress, Schedule, Video, dan Meal Plan!
          </p>
          <button
            className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg,#e03030,#a00020)" }} onClick={() => onNavigate("payment")}
          >
            Upgrade Sekarang
          </button>
        </div>
      )}

      {/* ── Tombol Ubah Data Diri ── */}
      <button
        onClick={() => onNavigate("data-diri")}
        className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all hover:brightness-110 mb-3"
        style={{ background: "linear-gradient(135deg, #1a6ebd, #0a3a7a)", border: "1px solid rgba(26,110,189,0.5)" }}
      >
        📝 Ubah Data Diri
      </button>

      {/* ── Tombol Logout ── */}
      <button
        onClick={onLogout}
        className="w-full py-3 rounded-xl font-bold text-red-400 text-sm transition-all hover:bg-red-900/20"
        style={{ border: "1px solid rgba(220,38,38,0.3)" }}
      >
        🚪 Logout dari Akun
      </button>
    </div>
  );
};

export default ProfileContent;
