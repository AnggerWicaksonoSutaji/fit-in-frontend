/**
 * ProgressContent.jsx
 * ─────────────────────────────────────────────────
 * Halaman "Progress Tracking" untuk memantau perkembangan latihan.
 * Fitur ini hanya tersedia untuk pengguna Premium.
 *
 * Menampilkan:
 *   - Jika non-premium → LockedPage placeholder
 *   - Jika premium → Kartu statistik + Grafik batang progress mingguan
 *
 * Data diambil dari localStorage dengan key "fitinStats":
 *   - workouts : Jumlah sesi workout yang telah diselesaikan
 *   - calories : Total kalori yang sudah terbakar
 *   - streak   : Jumlah hari berturut-turut berlatih
 *   - goalPct  : Persentase pencapaian goal (0–100)
 *
 * Tidak ada props yang dibutuhkan.
 * ─────────────────────────────────────────────────
 */

import LockedPage from "../components/LockedPage";

const ProgressContent = () => {
  // Cek apakah pengguna sudah berlangganan premium
  const isPremium = localStorage.getItem("fitinPremium") === "true";

  // Jika bukan premium, tampilkan halaman terkunci
  if (!isPremium) return <LockedPage title="Progress Tracking" emoji="📊" />;

  // Ambil data statistik dari localStorage, gunakan default jika belum ada
  const rawStats = localStorage.getItem("fitinStats");
  const stats = rawStats
    ? JSON.parse(rawStats)
    : { workouts: 0, calories: 0, streak: 0, goalPct: 0 };

  // Label minggu untuk grafik progress
  const weeks = ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"];

  return (
    <div>
      {/* ── Header Halaman ── */}
      <h2 className="text-white text-2xl font-black mb-2">Progress Tracking</h2>
      <p className="text-gray-500 text-sm mb-6">Pantau perkembangan fitness kamu</p>

      {/* ── Grid Kartu Statistik ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Workout",  value: stats.workouts,              color: "#e03030" },
          { label: "Kalori Terbakar",value: stats.calories + " kcal",   color: "#1a6ebd" },
          { label: "Streak",         value: stats.streak + " hari",     color: "#8b1a8b" },
          { label: "Goal",           value: stats.goalPct + "%",        color: "#16a34a" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-4 text-center"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${s.color}25`,
            }}
          >
            <div className="text-2xl font-black" style={{ color: s.color }}>
              {s.value}
            </div>
            <p className="text-gray-500 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Grafik Progress Mingguan (Bar Chart Sederhana) ── */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h3 className="text-white font-bold text-sm mb-4">Progress Mingguan</h3>

        {/* Container grafik batang */}
        <div className="flex items-end gap-3 h-40">
          {weeks.map((w, i) => {
            // Tinggi batang dihitung berdasarkan jumlah workout + indeks minggu
            // Minimal 8px, maksimal 100% dari tinggi container
            const h = Math.min(100, 20 + stats.workouts * 8 + i * 15);
            return (
              <div key={w} className="flex-1 flex flex-col items-center">
                {/* Batang grafik dengan gradasi merah ke biru */}
                <div
                  className="w-full rounded-t-lg transition-all"
                  style={{
                    height: h + "%",
                    background: "linear-gradient(180deg, #e03030, #1a6ebd)",
                    minHeight: "8px",
                  }}
                />
                {/* Label minggu di bawah batang */}
                <p className="text-gray-500 text-xs mt-2">{w}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressContent;
