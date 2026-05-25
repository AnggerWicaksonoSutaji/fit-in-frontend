/**
 * HomeContent.jsx
 * ─────────────────────────────────────────────────
 * Halaman utama (Home) dashboard FIT-IN.
 *
 * Menampilkan:
 *   1. Banner selamat datang + nama pengguna
 *   2. Tombol "Selesaikan Workout Hari Ini" yang memperbarui statistik
 *   3. Kartu statistik: Workout, Kalori, Streak, Goal
 *   4. Preview daftar Workout Program
 *   5. Preview daftar Workout Video
 *
 * Data statistik diambil dan disimpan ke localStorage dengan key "fitinStats".
 * Status premium diambil dari localStorage dengan key "fitinPremium".
 *
 * Props:
 *   - user (object) : Data pengguna dari localStorage (nama, email, dll)
 * ─────────────────────────────────────────────────
 */

import ProgramCard from "../components/ProgramCard";
import VideoCard from "../components/VideoCard";
import { workoutPrograms } from "../data/workoutPrograms";
import { workoutCategories } from "../data/workoutCategories";

const HomeContent = ({ user }) => {
  // Cek apakah pengguna sudah berlangganan premium
  const isPremium = localStorage.getItem("fitinPremium") === "true";

  // Ambil data statistik dari localStorage, gunakan nilai default jika belum ada
  const rawStats = localStorage.getItem("fitinStats");
  const stats = rawStats
    ? JSON.parse(rawStats)
    : { workouts: 0, calories: 0, streak: 0 };

  /**
   * handleStartWorkout
   * Dipanggil saat pengguna menekan tombol "Selesaikan Workout Hari Ini".
   * Menambahkan 1 sesi workout, kalori acak (150-350 kcal), 1 hari streak,
   * dan menambah persentase goal secara acak (5-12%).
   */
  const handleStartWorkout = () => {
    const updated = {
      workouts: stats.workouts + 1,
      calories: stats.calories + Math.floor(Math.random() * 200 + 150),
      streak: stats.streak + 1,
    };
    // Simpan statistik baru ke localStorage
    localStorage.setItem("fitinStats", JSON.stringify(updated));
    // Refresh halaman agar statistik terupdate di tampilan
    window.location.reload();
  };

  return (
    <div>
      {/* ── Banner Selamat Datang ── */}
      <div
        className="rounded-2xl p-6 mb-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #c0001a 0%, #6b1a6b 50%, #1a4fa0 100%)" }}
      >
        {/* Emoji dekoratif di pojok kanan */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-8xl opacity-20">🏋️</div>

        {/* Sapaan pengguna */}
        <h2 className="text-2xl font-black text-white mb-1">
          Selamat datang, {user?.name || "Athlete"}! 💪
        </h2>
        <p className="text-white/70 text-sm">Hari ini adalah hari yang tepat untuk berolahraga!</p>

        {/* Badge PREMIUM MEMBER hanya tampil jika pengguna premium */}
        {isPremium && (
          <span
            className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold"
            style={{
              background: "rgba(251,191,36,0.2)",
              color: "#fbbf24",
              border: "1px solid rgba(251,191,36,0.4)",
            }}
          >
            ⭐ PREMIUM MEMBER
          </span>
        )}

        <br />

        {/* Tombol aksi untuk menyelesaikan workout */}
        <button
          onClick={handleStartWorkout}
          className="mt-4 px-6 py-2.5 rounded-xl text-sm font-bold bg-white text-red-600 hover:bg-gray-100 transition-all"
        >
          Selesaikan Workout Hari Ini ✓
        </button>
      </div>

      {/* ── Kartu Statistik ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Workout", value: String(stats.workouts), unit: "sesi",    color: "#e03030", icon: "🔥" },
          { label: "Kalori",  value: String(stats.calories), unit: "kcal",    color: "#1a6ebd", icon: "⚡" },
          { label: "Streak",  value: String(stats.streak),   unit: "hari",    color: "#8b1a8b", icon: "📅" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${stat.color}20`,
            }}
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-black" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="text-gray-500 text-xs">{stat.unit}</div>
            <div className="text-gray-400 text-xs mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Preview Workout Programs ── */}
      <h3 className="text-white font-bold text-lg mb-4">Workout Program</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {workoutPrograms.map((p) => (
          <ProgramCard key={p.title} program={p} />
        ))}
      </div>

      {/* ── Preview Workout Video ── */}
      <h3 className="text-white font-bold text-lg mb-4">🎬 Workout Video</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {workoutCategories.map((v) => (
          /* Override properti locked: jika premium, semua konten terbuka */
          <VideoCard key={v.id} video={{ ...v, locked: isPremium ? false : v.locked }} />
        ))}
      </div>
    </div>
  );
};

export default HomeContent;
