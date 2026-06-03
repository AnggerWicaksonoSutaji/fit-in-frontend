import { useState, useEffect } from "react";
import LockedPage from "../components/LockedPage";

import { dayColors, dayNames, schedules } from "../data/schedules";

const ScheduleContent = ({ onNavigate }) => {
  const isPremium = localStorage.getItem("fitinPremium") === "true";

  const [viewMode, setViewMode] = useState("calendar"); // 'weekly' or 'calendar'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // State untuk menyimpan rutinitas kustom harian pengguna
  const [customSchedules, setCustomSchedules] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editFocus, setEditFocus] = useState("");
  const [editExercises, setEditExercises] = useState("");

  useEffect(() => {
    // Memuat rutinitas kustom dari localStorage saat komponen di-mount
    const rawCustom = localStorage.getItem("fitinCustomSchedules");
    if (rawCustom) {
      try {
        setCustomSchedules(JSON.parse(rawCustom));
      } catch (e) {
        console.error("Gagal memuat custom schedules", e);
      }
    }
  }, []);

  if (!isPremium) return <LockedPage title="Workout Schedule" emoji="📅" onNavigate={onNavigate} />;

  const rawProfile = localStorage.getItem("fitinProfile");
  const profile = rawProfile ? JSON.parse(rawProfile) : { goal: "maintenance" };
  const schedule = schedules[profile.goal] || schedules.maintenance;

  // Fungsi helper untuk memformat Date objek menjadi YYYY-MM-DD
  const formatDate = (d) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Fungsi untuk menyimpan perubahan rutinitas harian
  const handleSaveCustom = () => {
    const dateStr = formatDate(selectedDate);
    const updated = { ...customSchedules };

    // Jika dikosongkan, hapus custom routine pada hari itu (kembali ke default)
    if (!editFocus.trim() && !editExercises.trim()) {
      delete updated[dateStr];
    } else {
      updated[dateStr] = {
        focus: editFocus,
        exercises: editExercises.split(",").map(e => e.trim()).filter(e => e)
      };
    }

    setCustomSchedules(updated);
    localStorage.setItem("fitinCustomSchedules", JSON.stringify(updated));
    setIsEditing(false);
  };

  // Mendapatkan detail rutinitas untuk tanggal yang dipilih
  const selectedDateStr = formatDate(selectedDate);
  const selectedDayIndex = (selectedDate.getDay() + 6) % 7; // Convert 0(Sun)-6(Sat) to 0(Mon)-6(Sun)
  const defaultRoutine = schedule[selectedDayIndex];
  const currentRoutine = customSchedules[selectedDateStr] || defaultRoutine;

  const handleEditClick = () => {
    setEditFocus(currentRoutine.focus);
    setEditExercises(currentRoutine.exercises.join(", "));
    setIsEditing(true);
  };

  // Logika pembentukan Kalender
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayJs = new Date(year, month, 1).getDay(); // 0(Sun) - 6(Sat)
  const startEmptyCells = (firstDayJs + 6) % 7; // Convert agar Senin menjadi kolom ke-0

  const days = [];
  for (let i = 0; i < startEmptyCells; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

  return (
    <div className="pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-white text-2xl font-black mb-1">Workout Schedule</h2>
          <p className="text-gray-500 text-sm">
            Jadwal latihan untuk program {profile.goal}
          </p>
        </div>

        {/* Toggle Tampilan */}
        <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
          <button
            onClick={() => setViewMode("weekly")}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === "weekly" ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"}`}
          >
            Mingguan
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === "calendar" ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"}`}
          >
            Kalender
          </button>
        </div>
      </div>

      {viewMode === "weekly" ? (
        /* ── TAMPILAN MINGGUAN (DEFAULT LAMA) ── */
        <div className="flex flex-col gap-3">
          {schedule.map((s, i) => {
            const isToday = i === (new Date().getDay() + 6) % 7;
            return (
              <div
                key={s.day}
                className="rounded-2xl p-4 flex items-start gap-4 relative overflow-hidden transition-all"
                style={{
                  background: isToday ? `linear-gradient(to right, rgba(255,255,255,0.05), ${dayColors[i]}20)` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isToday ? dayColors[i] : `${dayColors[i]}20`}`,
                  boxShadow: isToday ? `0 0 20px ${dayColors[i]}30` : "none"
                }}
              >
                {isToday && (
                  <span
                    className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider"
                    style={{ backgroundColor: dayColors[i], color: '#fff' }}
                  >
                    HARI INI
                  </span>
                )}
                <div className="w-16 text-center flex-shrink-0">
                  <p className="font-black text-sm" style={{ color: dayColors[i] }}>{s.day}</p>
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-sm mb-1">{s.focus}</p>
                  <div className="flex flex-wrap gap-1">
                    {s.exercises.map((e) => (
                      <span key={e} className="px-2 py-0.5 rounded-full text-xs" style={{ background: `${dayColors[i]}15`, color: dayColors[i] }}>
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── TAMPILAN KALENDER ── */
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Komponen Kalender Kiri */}
          <div className="xl:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white capitalize">
                {currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex gap-2">
                <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all text-white font-bold">{"<"}</button>
                <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all text-white font-bold">{">"}</button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
              {/* Header Hari */}
              {dayNames.map(d => <div key={d} className="text-center text-xs font-bold text-gray-500 py-2">{d.substring(0, 3)}</div>)}

              {/* Grid Tanggal */}
              {days.map((d, i) => {
                if (!d) return <div key={`empty-${i}`} className="p-2 md:p-3" />;

                const isToday = d.toDateString() === new Date().toDateString();
                const isSelected = selectedDate && d.toDateString() === selectedDate.toDateString();
                const dayIndex = (d.getDay() + 6) % 7;
                const dateStr = formatDate(d);
                const hasCustom = !!customSchedules[dateStr];
                const color = hasCustom ? "#f59e0b" : dayColors[dayIndex];

                return (
                  <div
                    key={i}
                    onClick={() => { setSelectedDate(d); setIsEditing(false); }}
                    className={`relative p-2 md:p-4 rounded-xl cursor-pointer transition-all border flex flex-col items-center justify-center ${isSelected ? 'border-red-500 bg-red-500/10' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
                  >
                    {isToday && (
                      <div className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-black/50 shadow-sm"></span>
                      </div>
                    )}
                    <span className={`text-sm md:text-base mb-1 md:mb-2 ${isToday ? 'text-red-400 font-bold' : 'text-gray-300'}`}>{d.getDate()}</span>
                    {/* Indikator titik jadwal */}
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} title={hasCustom ? "Custom Routine" : schedule[dayIndex].focus} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Panel Detail Kanan */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 h-max">
            <h3 className="text-lg font-bold text-white mb-1">
              {selectedDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h3>

            {customSchedules[selectedDateStr] ? (
              <span className="inline-block px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold mb-4">⭐ Custom Routine</span>
            ) : (
              <p className="text-sm text-gray-400 mb-4">Default Routine ({dayNames[selectedDayIndex]})</p>
            )}

            {isEditing ? (
              /* Mode Edit */
              <div className="flex flex-col gap-3 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Fokus Latihan</label>
                  <input
                    type="text"
                    value={editFocus}
                    onChange={(e) => setEditFocus(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                    placeholder="Contoh: Upper Body"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Daftar Gerakan (pisahkan dengan koma)</label>
                  <textarea
                    value={editExercises}
                    onChange={(e) => setEditExercises(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                    placeholder="Contoh: Push-ups, Pull-ups, Dips"
                    rows={3}
                  />
                  <p className="text-[10px] text-gray-500 mt-1">* Kosongkan semua form lalu simpan untuk mereset ke jadwal default.</p>
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={handleSaveCustom} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-red-500/20">Simpan</button>
                  <button onClick={() => setIsEditing(false)} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-lg text-sm font-bold transition-all">Batal</button>
                </div>
              </div>
            ) : (
              /* Mode Tampil Biasa */
              <div className="animate-fade-in">
                <p className="text-white font-black text-xl mb-4" style={{ color: customSchedules[selectedDateStr] ? "#f59e0b" : dayColors[selectedDayIndex] }}>
                  {currentRoutine.focus}
                </p>

                {currentRoutine.exercises.length > 0 ? (
                  <div className="flex flex-col gap-2 mb-6">
                    {currentRoutine.exercises.map((e, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-black/30 px-4 py-3 rounded-xl border border-white/5">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: customSchedules[selectedDateStr] ? "#f59e0b" : dayColors[selectedDayIndex] }}></span>
                        <span className="text-sm font-medium text-gray-200">{e}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mb-6 p-4 text-center border border-dashed border-white/10 rounded-xl">
                    <p className="text-sm text-gray-500">Tidak ada gerakan</p>
                  </div>
                )}

                <button onClick={handleEditClick} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-sm font-bold transition-all">
                  Edit Rutinitas Harian
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleContent;
