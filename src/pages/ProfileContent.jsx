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
const InfoRow = ({ label, value, icon, onEdit }) => (
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

    {/* Tombol edit opsional */}
    {onEdit && (
      <button
        onClick={onEdit}
        className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:bg-white/10"
        style={{ color: "#3b82f6", border: "1px solid rgba(59,130,246,0.3)" }}
      >
        Ubah
      </button>
    )}
  </div>
);

import { useState, useEffect, useRef } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const ProfileContent = ({ onLogout, onNavigate }) => {
  // Ambil data pengguna dari localStorage sebagai state
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("fitinUser") || "{}"));

  const [tempUsername, setTempUsername] = useState(user?.name || "");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setTempUsername(user?.name || "");
  }, [user?.name]);

  useEffect(() => {
    if (isEditingUsername && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingUsername]);

  const handleSaveUsername = async () => {
    if (!tempUsername || tempUsername.trim() === "" || tempUsername.trim() === user?.name) {
      setIsEditingUsername(false);
      setTempUsername(user?.name || "");
      return;
    }
    try {
      const token = localStorage.getItem("fitinToken");
      if (!token) {
        alert("Sesi Anda telah berakhir. Silakan login ulang.");
        return;
      }

      const res = await api.patch(
        "/user/username",
        { username: tempUsername.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedUser = { ...user, name: res.data.user.name };
      localStorage.setItem("fitinUser", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditingUsername(false);

      window.location.reload();
    } catch (err) {
      console.error("Error changing username:", err);
      if (err.response?.status === 401) {
        alert("Sesi Anda telah berakhir. Silakan logout dan login ulang.");
        return;
      }
      const message = err.response?.data?.errors?.username?.[0]
        || err.response?.data?.message
        || `Gagal mengubah username.`;
      alert(message);
      setIsEditingUsername(false);
      setTempUsername(user?.name || "");
    }
  };


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
        <div
          className="flex items-center gap-4 p-4 rounded-xl transition-all"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: "rgba(224,48,48,0.1)" }}
          >
            👤
          </div>
          <div className="flex-1 min-w-0" onClick={() => setIsEditingUsername(true)}>
            <p className="text-gray-500 text-xs mb-0.5">Username (klik untuk mengubah)</p>
            {isEditingUsername ? (
              <input
                ref={inputRef}
                type="text"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                onBlur={handleSaveUsername}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveUsername()}
                className="w-full bg-transparent text-white font-semibold text-sm focus:outline-none focus:border-b focus:border-blue-500 pb-0.5 transition-all"
                placeholder="Masukkan username"
              />
            ) : (
              <p className="text-white font-semibold text-sm truncate cursor-pointer hover:text-blue-400 transition-colors">
                {user?.name || "-"}
              </p>
            )}
          </div>
          {isEditingUsername && (
            <button
              onMouseDown={(e) => { e.preventDefault(); handleSaveUsername(); }}
              className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:bg-white/10"
              style={{ color: "#3b82f6", border: "1px solid rgba(59,130,246,0.3)" }}
            >
              Simpan
            </button>
          )}
        </div>
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

      {/* ── Tombol Ubah Data Diri (HANYA MUNCUL UNTUK PREMIUM) ── */}
      {isPremium && (
        <button
          onClick={() => onNavigate("data-diri")}
          className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all hover:brightness-110 mb-3"
          style={{ background: "linear-gradient(135deg, #1a6ebd, #0a3a7a)", border: "1px solid rgba(26,110,189,0.5)" }}
        >
          📝 Ubah Data Diri
        </button>
      )}

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
