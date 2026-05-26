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
import { dayColors, dayNames, schedules } from "../data/schedules";

const HomeContent = ({ user, onNavigate, setActive, setSelectedVideoCategory }) => {
  // Cek apakah pengguna sudah berlangganan premium
  const isPremium = localStorage.getItem("fitinPremium") === "true";

  // Ambil data statistik dari localStorage, gunakan nilai default jika belum ada
  const rawStats = localStorage.getItem("fitinStats");
  const stats = rawStats
    ? JSON.parse(rawStats)
    : { workouts: 0, calories: 0, streak: 0 };

  // Ambil data profile untuk mengetahui program (goal) yang aktif
  const rawProfile = localStorage.getItem("fitinProfile");
  const profile = rawProfile ? JSON.parse(rawProfile) : { goal: "maintenance" };
  const activeProgram = workoutPrograms.find(p => p.title.toLowerCase() === profile.goal.toLowerCase()) || workoutPrograms.find(p => p.title.toLowerCase() === "maintenance");
  
  // Dapatkan nama hari ini dalam bahasa Indonesia
  const today = new Date();
  const currentDay = today.toLocaleDateString('id-ID', { weekday: 'long' });

  // ── LOGIKA JADWAL HARI INI ──
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const dayIndex = (today.getDay() + 6) % 7; // Convert 0(Sun)-6(Sat) to 0(Mon)-6(Sun)
  
  const rawCustom = localStorage.getItem("fitinCustomSchedules");
  const customSchedules = rawCustom ? JSON.parse(rawCustom) : {};
  const defaultRoutine = (schedules[profile.goal] || schedules.maintenance)[dayIndex];
  const todayRoutine = customSchedules[dateStr] || defaultRoutine;
  const isCustomRoutine = !!customSchedules[dateStr];
  const todayColor = isCustomRoutine ? "#f59e0b" : dayColors[dayIndex];

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
        <p className="text-white/70 text-sm">Hari {currentDay} adalah hari yang tepat untuk berolahraga!</p>

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
      </div>

      {/* ── Kartu Statistik ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Workout", value: String(stats.workouts), unit: "sesi", color: "#e03030", icon: "🔥" },
          { label: "Kalori", value: String(stats.calories), unit: "kcal", color: "#1a6ebd", icon: "⚡" },
          { label: "Streak", value: String(stats.streak), unit: "hari", color: "#8b1a8b", icon: "📅" },
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

      {/* ── Jadwal Latihan Hari Ini (Hanya Premium) ── */}
      {isPremium && (
        <div className="mb-8">
        <h3 className="text-white font-bold text-lg mb-4">📅 Jadwal Latihan Hari Ini</h3>
        <div 
          className="rounded-2xl p-5 relative overflow-hidden transition-all hover:shadow-xl"
          style={{ 
            background: "rgba(255,255,255,0.03)", 
            border: `1px solid ${todayColor}30`,
            boxShadow: `0 4px 20px ${todayColor}10`
          }}
        >
          {isCustomRoutine && (
            <span className="absolute top-4 right-4 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-[10px] font-bold rounded-md border border-yellow-500/30">
              ⭐ CUSTOM
            </span>
          )}
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
            {currentDay} • {todayRoutine.exercises.length === 0 ? "Rest Day" : "Workout Day"}
          </p>
          <h4 className="text-white text-xl font-black mb-4" style={{ color: todayColor }}>
            {todayRoutine.focus}
          </h4>
          
          {todayRoutine.exercises.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {todayRoutine.exercises.map((e, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{ background: `${todayColor}15`, color: "#ddd", border: `1px solid ${todayColor}30` }}
                >
                  {e}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">Tidak ada gerakan dijadwalkan untuk hari ini. Selamat beristirahat!</p>
          )}

          {isPremium && (
            <button 
              onClick={() => onNavigate("schedule")}
              className="mt-4 text-xs font-bold text-gray-400 hover:text-white transition-colors"
            >
              Lihat Kalender Penuh &rarr;
            </button>
          )}
        </div>
      </div>
      )}

      {/* ── Preview Workout Programs ── */}
      <h3 className="text-white font-bold text-lg mb-4">
        {isPremium ? "Workout Program yang Anda Pilih" : "Workout Program"}
      </h3>
      <div className={`grid grid-cols-1 ${!isPremium ? 'md:grid-cols-3' : ''} gap-4 mb-6`}>
        {isPremium ? (
          <ProgramCard
            program={activeProgram}
            hideButton={true}
            onChangeProgram={() => onNavigate("data-diri")}
          />
        ) : (
          workoutPrograms.map((p) => (
            <ProgramCard key={p.title} program={p} />
          ))
        )}
      </div>

      {/* ── Preview Workout Video ── */}
      <h3 className="text-white font-bold text-lg mb-4">🎬 Workout Video</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {workoutCategories.map((v) => (
          /* Override properti locked: jika premium, semua konten terbuka */
          <VideoCard
            key={v.id}
            video={{ ...v, locked: isPremium ? false : v.locked }}
            onClick={() => {
              if (setSelectedVideoCategory && setActive) {
                setSelectedVideoCategory(v);
                setActive("video");
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeContent;
