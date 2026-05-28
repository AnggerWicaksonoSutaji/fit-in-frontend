import { useState, useEffect, useRef } from "react";
import { navItems } from "./data/navItems";
import Sidebar from "./components/Sidebar";
import UpgradePopup from "./components/UpgradePopup";

// Pages
import HomeContent from "./pages/HomeContent";
import WorkoutContent from "./pages/WorkoutContent";
import VideoContent from "./pages/VideoContent";
import NutritionContent from "./pages/NutritionContent";
import BMIContent from "./pages/BMIContent";
import ProgressContent from "./pages/ProgressContent";
import ScheduleContent from "./pages/ScheduleContent";
import ProfileContent from "./pages/ProfileContent";

export default function Dashboard({ onLogout, onNavigate }) {
  const [active, setActive] = useState(() => sessionStorage.getItem("fitinDashboardTab") || "home");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("fitinDashboardTab", active);
  }, [active]);
  const isPremium = localStorage.getItem("fitinPremium") === "true";
  const [showPopup, setShowPopup] = useState(!isPremium);
  const [selectedVideoCategory, setSelectedVideoCategory] = useState(null);

  const user = JSON.parse(localStorage.getItem("fitinUser") || '{"name":"Athlete"}');
  // Pastikan userId selalu valid — gunakan id, fallback ke email, lalu ke name
  const userId = user?.id || user?.email || user?.name || "guest";

  // ── Auto-migrate data lama (sebelum fitur isolasi per-user) ──
  if (userId !== "guest") {
    const oldStats = localStorage.getItem("fitinStats");
    const newStats = localStorage.getItem(`fitinStats_${userId}`);
    if (oldStats && !newStats) {
      localStorage.setItem(`fitinStats_${userId}`, oldStats);
    }
    const oldDate = localStorage.getItem("fitinLastWorkoutDate");
    const newDate = localStorage.getItem(`fitinLastWorkoutDate_${userId}`);
    if (oldDate && !newDate) {
      localStorage.setItem(`fitinLastWorkoutDate_${userId}`, oldDate);
    }
    const oldHistory = localStorage.getItem("fitinDailyHistory");
    const newHistory = localStorage.getItem(`fitinDailyHistory_${userId}`);
    if (oldHistory && !newHistory) {
      localStorage.setItem(`fitinDailyHistory_${userId}`, oldHistory);
    }
  }

  const handleUpgrade = () => {
    setShowPopup(false);
    onNavigate("payment");
  };

  // Global Timer State
  const [workoutSeconds, setWorkoutSeconds] = useState(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const timerRef = useRef(null);

  const [stats, setStats] = useState(() => {
    const raw = localStorage.getItem(`fitinStats_${userId}`);
    const parsed = raw ? JSON.parse(raw) : { workouts: 0, calories: 0, streak: 0 };

    // ── Reset harian: cek apakah lastWorkoutDate adalah hari ini ──
    const todayStr = new Date().toISOString().slice(0, 10);
    const lastDate = localStorage.getItem(`fitinLastWorkoutDate_${userId}`);

    let streak = parsed.streak;
    // Jika terakhir workout BUKAN kemarin dan BUKAN hari ini → streak reset
    if (lastDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);
      if (lastDate !== todayStr && lastDate !== yesterdayStr) {
        streak = 0;
        const updated = { ...parsed, streak: 0, todaySessions: 0, todayCalories: 0 };
        localStorage.setItem(`fitinStats_${userId}`, JSON.stringify(updated));
        return updated;
      }
    }

    // Reset todaySessions & todayCalories jika hari sudah berganti
    if (lastDate && lastDate !== todayStr) {
      const updated = { ...parsed, streak, todaySessions: 0, todayCalories: 0 };
      localStorage.setItem(`fitinStats_${userId}`, JSON.stringify(updated));
      return updated;
    }

    return { ...parsed, streak };
  });

  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const [newStreakCount, setNewStreakCount] = useState(0);

  const [timerPos, setTimerPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0 });

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!isDragging) return;
      setTimerPos({
        x: e.clientX - dragRef.current.startX,
        y: e.clientY - dragRef.current.startY,
      });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging]);

  const handlePointerDown = (e) => {
    // Jangan drag jika yang diklik adalah tombol
    if (e.target.closest("button")) return;
    
    e.preventDefault();
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX - timerPos.x,
      startY: e.clientY - timerPos.y,
    };
  };

  const beratBadan = 70; // Mock kg
  const MET = 6.0;

  useEffect(() => {
    if (isWorkoutActive) {
      timerRef.current = setInterval(() => {
        setWorkoutSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isWorkoutActive]);

  const startGlobalWorkout = () => {
    setWorkoutSeconds(0);
    setIsWorkoutActive(true);
    setShowCelebrationModal(false);

    // ── Logika Streak: tambah 1x per hari ──
    const todayStr = new Date().toISOString().slice(0, 10);
    const lastDate = localStorage.getItem(`fitinLastWorkoutDate_${userId}`);

    if (lastDate !== todayStr) {
      // Ini sesi pertama hari ini → update streak
      localStorage.setItem(`fitinLastWorkoutDate_${userId}`, todayStr);
      setStats((prev) => {
        const newStreak = prev.streak + 1;
        const updated = { ...prev, streak: newStreak };
        localStorage.setItem(`fitinStats_${userId}`, JSON.stringify(updated));
        setNewStreakCount(newStreak);
        setShowStreakPopup(true);
        // Auto-hide popup setelah 3 detik
        setTimeout(() => setShowStreakPopup(false), 3000);
        return updated;
      });
    }
  };

  const handleEndGlobalWorkout = () => {
    setIsWorkoutActive(false);
    clearInterval(timerRef.current);

    const minutes = workoutSeconds / 60;
    const calories = ((MET * 3.5 * beratBadan) / 200) * minutes;
    setCaloriesBurned(calories);
    setShowCelebrationModal(true);

    const todayStr = new Date().toISOString().slice(0, 10);

    setStats((prev) => {
      const newStats = {
        ...prev,
        workouts: prev.workouts + 1,
        calories: Math.round(prev.calories + calories),
        todaySessions: (prev.todaySessions || 0) + 1,
        todayCalories: Math.round((prev.todayCalories || 0) + calories),
      };
      localStorage.setItem(`fitinStats_${userId}`, JSON.stringify(newStats));

      // ── Simpan history harian untuk grafik bulanan ──
      const rawHistory = localStorage.getItem(`fitinDailyHistory_${userId}`);
      const history = rawHistory ? JSON.parse(rawHistory) : {};
      history[todayStr] = {
        sessions: newStats.todaySessions,
        calories: newStats.todayCalories,
        streak: newStats.streak,
      };
      // Batasi hanya simpan 90 hari terakhir
      const sortedKeys = Object.keys(history).sort().slice(-90);
      const trimmed = {};
      sortedKeys.forEach(k => { trimmed[k] = history[k]; });
      localStorage.setItem(`fitinDailyHistory_${userId}`, JSON.stringify(trimmed));

      return newStats;
    });
  };

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const renderContent = () => {
    switch (active) {
      case "home": return <HomeContent 
        user={user} 
        onNavigate={onNavigate} 
        setActive={setActive} 
        setSelectedVideoCategory={setSelectedVideoCategory} 
        startGlobalWorkout={startGlobalWorkout} 
        isWorkoutActive={isWorkoutActive}
        workoutSeconds={workoutSeconds}
        liveCalories={((MET * 3.5 * beratBadan) / 200) * (workoutSeconds / 60)}
        stats={stats}
      />;
      case "workout": return <WorkoutContent />;
      case "video": return <VideoContent initialCategory={selectedVideoCategory} onClearCategory={() => setSelectedVideoCategory(null)} />;
      case "nutrition": return <NutritionContent onNavigate={onNavigate} />;
      case "bmi": return <BMIContent />;
      case "progress": return <ProgressContent stats={stats} user={user} />;
      case "schedule": return <ScheduleContent />;
      case "profile": return <ProfileContent onLogout={onLogout} />;
      default: return <HomeContent 
        user={user} 
        onNavigate={onNavigate} 
        setActive={setActive} 
        setSelectedVideoCategory={setSelectedVideoCategory} 
        startGlobalWorkout={startGlobalWorkout} 
        isWorkoutActive={isWorkoutActive}
        workoutSeconds={workoutSeconds}
        liveCalories={((MET * 3.5 * beratBadan) / 200) * (workoutSeconds / 60)}
        stats={stats}
      />;
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: "#0a0a0a", fontFamily: "'Trebuchet MS', sans-serif" }}>

      {showPopup && (
        <UpgradePopup
          onClose={() => setShowPopup(false)}
          onUpgrade={handleUpgrade}
        />
      )}

      {/* ── Streak Notification Popup ── */}
      {showStreakPopup && (
        <div
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            border: "1px solid rgba(167,139,250,0.4)",
            boxShadow: "0 8px 40px rgba(124,58,237,0.5)",
            animation: "slideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
          }}
        >
          <style>{`
            @keyframes slideDown {
              from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
              to   { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
          `}</style>
          <div className="text-4xl">🔥</div>
          <div>
            <p className="text-purple-200 text-[10px] font-bold uppercase tracking-widest">Streak Meningkat!</p>
            <p className="text-white text-xl font-black">{newStreakCount} Hari Berturut-turut</p>
            <p className="text-purple-300 text-xs mt-0.5">Pertahankan semangat latihan kamu!</p>
          </div>
        </div>
      )}

      <Sidebar
        active={active}
        setActive={setActive}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        onLogout={onLogout}
        onNavigate={onNavigate}
        isPremium={isPremium}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4"
          style={{ background: "rgba(10,10,10,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <h1 className="text-white font-bold text-lg capitalize">
            {navItems.find(n => n.key === active)?.label || "Dashboard"}
          </h1>
          <div className="flex items-center gap-3">
            {!isPremium ? (
              <button
                onClick={() => { setShowPopup(false); onNavigate("payment"); }}
                className="px-4 py-2 rounded-lg text-xs font-bold text-yellow-400 transition-all hover:brightness-110"
                style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)" }}>
                ⭐ Upgrade
              </button>
            ) : (
              <span className="px-3 py-1.5 rounded-lg text-xs font-bold text-yellow-400"
                style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)" }}>
                ⭐ Premium
              </span>
            )}
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ background: "linear-gradient(135deg,#e03030,#1a6ebd)" }}>
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
          </div>
        </div>
        <div className="p-6">{renderContent()}</div>
      </main>

      {/* ── Floating Timer Widget ── */}
      {isWorkoutActive && (
        <div 
          className="fixed bottom-8 right-8 z-40 bg-black/80 backdrop-blur-md border border-red-500/30 p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex items-center gap-6 select-none" 
          style={{ 
            transform: `translate(${timerPos.x}px, ${timerPos.y}px)`,
            cursor: isDragging ? "grabbing" : "grab",
            touchAction: "none" // Mencegah scroll di perangkat sentuh saat dragging
          }}
          onPointerDown={handlePointerDown}
        >
          <div>
            <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest mb-1">Workout Active</p>
            <p className="text-white text-3xl font-black tabular-nums tracking-tighter">{formatTime(workoutSeconds)}</p>
          </div>
          <button
            onClick={handleEndGlobalWorkout}
            className="px-5 py-3 rounded-xl font-bold text-white text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-500/20"
            style={{ background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" }}
          >
            ⏹ Akhiri
          </button>
        </div>
      )}

      {/* ── Global Celebration Modal ── */}
      {showCelebrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"></div>
          
          <div className="relative bg-[#1a1a1a] border border-white/10 p-8 rounded-[2rem] max-w-md w-full text-center shadow-[0_0_80px_rgba(239,68,68,0.3)] transform transition-all duration-500 scale-100 opacity-100 animate-[bounce_1s_ease-in-out]">
            <div className="text-8xl mb-6 animate-bounce">🎉</div>
            <h2 className="text-3xl font-black text-white mb-2">Kamu Luar Biasa!</h2>
            <p className="text-gray-400 text-sm mb-8">Sesi workout telah selesai. Ini adalah pencapaianmu hari ini:</p>
            
            <div className="flex justify-center gap-4 mb-8">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex-1">
                <p className="text-gray-500 text-xs font-bold uppercase mb-2 tracking-widest">Waktu</p>
                <p className="text-3xl font-black text-white">{formatTime(workoutSeconds)}</p>
              </div>
              <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20 flex-1">
                <p className="text-red-400/80 text-xs font-bold uppercase mb-2 tracking-widest">Kalori di bakar:</p>
                <p className="text-3xl font-black text-red-400">{caloriesBurned.toFixed(1)} <span className="text-sm font-medium">kcal</span></p>
              </div>
            </div>

            <button
              onClick={() => setShowCelebrationModal(false)}
              className="w-full py-4 rounded-xl font-bold text-white text-sm transition-all hover:bg-white/10 hover:scale-105 active:scale-95"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              Tutup & Kembali
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
