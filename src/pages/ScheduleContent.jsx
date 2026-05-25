/**
 * ScheduleContent.jsx
 * ─────────────────────────────────────────────────
 * Halaman "Workout Schedule" yang menampilkan jadwal latihan
 * mingguan sesuai dengan program/goal pengguna.
 * Fitur ini hanya tersedia untuk pengguna Premium.
 *
 * Logika:
 *   - Jika non-premium → tampilkan LockedPage
 *   - Jika premium → tampilkan jadwal 7 hari sesuai goal dari profil
 *     (bulking / cutting / maintenance)
 *
 * Data profil diambil dari localStorage dengan key "fitinProfile".
 * Jadwal default: maintenance (jika profil belum diisi).
 *
 * Tidak ada props yang dibutuhkan.
 * ─────────────────────────────────────────────────
 */

import LockedPage from "../components/LockedPage";

// Palet warna untuk 7 hari dalam seminggu
const dayColors = ["#e03030", "#1a6ebd", "#16a34a", "#8b1a8b", "#f59e0b", "#06b6d4", "#6b7280"];

/**
 * schedules
 * Data jadwal latihan untuk masing-masing program.
 * Setiap entry memiliki:
 *   - day       : Nama hari
 *   - focus     : Fokus latihan hari itu
 *   - exercises : Array nama gerakan yang dilakukan
 */
const schedules = {
  bulking: [
    { day: "Senin",  focus: "Chest & Triceps",  exercises: ["Bench Press", "Incline DB Press", "Tricep Dips"] },
    { day: "Selasa", focus: "Back & Biceps",    exercises: ["Deadlift", "Barbell Row", "Bicep Curl"] },
    { day: "Rabu",   focus: "Rest Day",         exercises: ["Stretching", "Light Walk"] },
    { day: "Kamis",  focus: "Shoulders & Abs",  exercises: ["OHP", "Lateral Raise", "Plank"] },
    { day: "Jumat",  focus: "Legs",             exercises: ["Squat", "Leg Press", "Calf Raise"] },
    { day: "Sabtu",  focus: "Full Body",        exercises: ["Clean & Press", "Pull-ups", "Lunges"] },
    { day: "Minggu", focus: "Rest Day",         exercises: ["Recovery", "Foam Rolling"] },
  ],
  cutting: [
    { day: "Senin",  focus: "HIIT Cardio",      exercises: ["Burpees", "Mountain Climbers", "Jump Squats"] },
    { day: "Selasa", focus: "Upper Body",       exercises: ["Push-ups", "DB Row", "Shoulder Press"] },
    { day: "Rabu",   focus: "Cardio",           exercises: ["Running 30min", "Jump Rope"] },
    { day: "Kamis",  focus: "Lower Body",       exercises: ["Squats", "Lunges", "Calf Raise"] },
    { day: "Jumat",  focus: "HIIT + Core",      exercises: ["Plank", "Russian Twist", "Sprints"] },
    { day: "Sabtu",  focus: "Active Recovery",  exercises: ["Yoga", "Light Jog"] },
    { day: "Minggu", focus: "Rest Day",         exercises: ["Stretching"] },
  ],
  maintenance: [
    { day: "Senin",  focus: "Push Day",         exercises: ["Bench Press", "OHP", "Tricep Extension"] },
    { day: "Selasa", focus: "Pull Day",         exercises: ["Pull-ups", "Barbell Row", "Bicep Curl"] },
    { day: "Rabu",   focus: "Cardio",           exercises: ["Running 20min", "Cycling"] },
    { day: "Kamis",  focus: "Legs",             exercises: ["Squat", "Leg Curl", "Calf Raise"] },
    { day: "Jumat",  focus: "Full Body",        exercises: ["Deadlift", "Dips", "Plank"] },
    { day: "Sabtu",  focus: "Light Cardio",     exercises: ["Swimming", "Walking"] },
    { day: "Minggu", focus: "Rest Day",         exercises: ["Rest & Recover"] },
  ],
};

const ScheduleContent = () => {
  // Cek apakah pengguna sudah berlangganan premium
  const isPremium = localStorage.getItem("fitinPremium") === "true";

  // Jika bukan premium, tampilkan halaman terkunci
  if (!isPremium) return <LockedPage title="Workout Schedule" emoji="📅" />;

  // Ambil goal dari profil pengguna, fallback ke "maintenance"
  const rawProfile = localStorage.getItem("fitinProfile");
  const profile = rawProfile ? JSON.parse(rawProfile) : { goal: "maintenance" };

  // Ambil jadwal sesuai goal, fallback ke maintenance jika goal tidak dikenali
  const schedule = schedules[profile.goal] || schedules.maintenance;

  return (
    <div>
      {/* ── Header Halaman ── */}
      <h2 className="text-white text-2xl font-black mb-2">Workout Schedule</h2>
      <p className="text-gray-500 text-sm mb-6">
        Jadwal latihan mingguan untuk program {profile.goal}
      </p>

      {/* ── Daftar Jadwal 7 Hari ── */}
      <div className="flex flex-col gap-3">
        {schedule.map((s, i) => (
          <div
            key={s.day}
            className="rounded-2xl p-4 flex items-start gap-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${dayColors[i]}20`, // Border tipis dengan warna hari
            }}
          >
            {/* Nama Hari */}
            <div className="w-16 text-center flex-shrink-0">
              <p className="font-black text-sm" style={{ color: dayColors[i] }}>
                {s.day}
              </p>
            </div>

            {/* Fokus dan Daftar Gerakan */}
            <div className="flex-1">
              <p className="text-white font-bold text-sm mb-1">{s.focus}</p>
              <div className="flex flex-wrap gap-1">
                {s.exercises.map((e) => (
                  /* Tag badge untuk setiap gerakan */
                  <span
                    key={e}
                    className="px-2 py-0.5 rounded-full text-xs"
                    style={{
                      background: `${dayColors[i]}15`,
                      color: dayColors[i],
                    }}
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleContent;
