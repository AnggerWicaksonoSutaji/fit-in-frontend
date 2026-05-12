import { useState } from "react";

/* ══════════════════════════════════════════
   ICONS
══════════════════════════════════════════ */
const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const icons = {
  home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  workout: ["M6.5 6.5h11", "M6.5 17.5h11", "M12 2v20", "M2 12h4", "M18 12h4"],
  video: "M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z",
  nutrition: ["M18 8h1a4 4 0 0 1 0 8h-1", "M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z", "M6 1v3", "M10 1v3", "M14 1v3"],
  bmi: ["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z", "M12 6v6l4 2"],
  progress: ["M3 3v18h18", "M18 9l-5 5-4-4-3 3"],
  schedule: ["M8 2v4", "M16 2v4", "M3 10h18", "M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z"],
  profile: ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"],
  logout: ["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", "M16 17l5-5-5-5", "M21 12H9"],
  menu: ["M3 12h18", "M3 6h18", "M3 18h18"],
  close: ["M18 6L6 18", "M6 6l12 12"],
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  lock: ["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z", "M7 11V7a5 5 0 0 1 10 0v4"],
  fire: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
  check: "M20 6L9 17l-5-5",
};

/* ══════════════════════════════════════════
   LOGO
══════════════════════════════════════════ */
const Logo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
    <path d="M15 85 Q35 50 100 45 L85 110 Q50 105 15 85Z" fill="url(#rG)" opacity="0.9" />
    <path d="M185 85 Q165 50 100 45 L115 110 Q150 105 185 85Z" fill="url(#bG)" opacity="0.9" />
    <path d="M85 110 Q100 170 100 170 Q100 170 115 110 L100 45Z" fill="url(#cG)" />
    <ellipse cx="100" cy="82" rx="18" ry="14" fill="url(#eG)" />
    <ellipse cx="100" cy="82" rx="9" ry="7" fill="#1a0a0a" />
    <defs>
      <linearGradient id="rG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ff2020" /><stop offset="100%" stopColor="#c0001a" />
      </linearGradient>
      <linearGradient id="bG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1a6ebd" /><stop offset="100%" stopColor="#0a3a7a" />
      </linearGradient>
      <linearGradient id="cG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e03030" /><stop offset="50%" stopColor="#8b1a8b" /><stop offset="100%" stopColor="#1a6ebd" />
      </linearGradient>
      <radialGradient id="eG" cx="50%" cy="40%">
        <stop offset="0%" stopColor="#ff5555" /><stop offset="100%" stopColor="#cc0000" />
      </radialGradient>
    </defs>
  </svg>
);

/* ══════════════════════════════════════════
   DATA
══════════════════════════════════════════ */
const workoutPrograms = [
  {
    title: "Bulking",
    color: "#e03030",
    desc: "Bulking adalah fase dalam program fitness yang bertujuan untuk meningkatkan massa otot dan berat badan melalui kombinasi latihan beban intensif dan peningkatan asupan kalori (surplus kalori).",
    tags: ["Strength", "High Calories", "Muscle Gain"],
    locked: false,
  },
  {
    title: "Cutting",
    color: "#1a6ebd",
    desc: "Cutting adalah fase yang bertujuan untuk menurunkan lemak tubuh sambil mempertahankan massa otot dengan cara mengurangi asupan kalori (defisit kalori) dan meningkatkan aktivitas fisik.",
    tags: ["Cardio", "Low Calories", "Fat Loss"],
    locked: false,
  },
  {
    title: "Maintenance",
    color: "#8b1a8b",
    desc: "Maintenance adalah fase untuk menjaga komposisi tubuh yang sudah ideal, yaitu dengan menyeimbangkan asupan kalori dan aktivitas fisik agar berat badan dan massa otot tetap stabil.",
    tags: ["Balance", "Normal Calories", "Stable"],
    locked: false,
  },
];

const videos = [
  { title: "Full Body Workout Beginner", duration: "15 min", level: "Beginner", locked: false, thumb: "🏃" },
  { title: "Upper Body Strength Training", duration: "25 min", level: "Intermediate", locked: true, thumb: "💪" },
  { title: "HIIT Cardio Blast", duration: "20 min", level: "Advanced", locked: true, thumb: "🔥" },
  { title: "Core & Abs Routine", duration: "18 min", level: "Intermediate", locked: true, thumb: "⚡" },
];

const navItems = [
  { key: "home", label: "Home", icon: icons.home },
  { key: "workout", label: "Workout Program", icon: icons.workout },
  { key: "video", label: "Workout Video", icon: icons.video },
  { key: "nutrition", label: "Nutrition", icon: icons.nutrition },
  { key: "bmi", label: "BMI Calculator", icon: icons.bmi },
  { key: "progress", label: "Progress", icon: icons.progress },
  { key: "schedule", label: "Schedule", icon: icons.schedule },
  { key: "profile", label: "Profile", icon: icons.profile },
];

/* ══════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════ */
const Sidebar = ({ active, setActive, collapsed, setCollapsed, onLogout }) => (
  <aside
    className="flex flex-col h-screen sticky top-0 transition-all duration-300 z-30"
    style={{
      width: collapsed ? 70 : 240,
      background: "linear-gradient(180deg, #0f0f0f 0%, #1a0a0a 50%, #0a0a1a 100%)",
      borderRight: "1px solid rgba(255,255,255,0.07)",
    }}
  >
    {/* Logo */}
    <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
      <Logo size={36} />
      {!collapsed && (
        <span className="font-black text-lg tracking-widest"
          style={{ background: "linear-gradient(90deg,#e03030,#cc44cc,#1a6ebd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          FIT-IN
        </span>
      )}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="ml-auto text-gray-500 hover:text-white transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {collapsed
            ? <><path d="M3 12h18" /><path d="M3 6h18" /><path d="M3 18h18" /></>
            : <><path d="M18 6L6 18" /><path d="M6 6l12 12" /></>
          }
        </svg>
      </button>
    </div>

    {/* Nav Items */}
    <nav className="flex-1 py-4 overflow-y-auto">
      {navItems.map((item) => {
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className="w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 relative group"
            style={{
              color: isActive ? "#fff" : "#666",
              background: isActive ? "linear-gradient(90deg, rgba(224,48,48,0.15), transparent)" : "transparent",
            }}
          >
            {/* Active indicator */}
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                style={{ background: "linear-gradient(180deg,#e03030,#cc44cc)" }} />
            )}
            <span className={`transition-colors ${isActive ? "text-red-400" : "text-gray-600 group-hover:text-gray-300"}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {Array.isArray(item.icon)
                  ? item.icon.map((p, i) => <path key={i} d={p} />)
                  : <path d={item.icon} />}
              </svg>
            </span>
            {!collapsed && (
              <span className={`text-sm font-medium tracking-wide transition-colors ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-200"}`}>
                {item.label}
              </span>
            )}
          </button>
        );
      })}
    </nav>

    {/* Upgrade Banner */}
    {!collapsed && (
      <div className="mx-3 mb-3 p-3 rounded-xl"
        style={{ background: "linear-gradient(135deg, rgba(224,48,48,0.2), rgba(26,110,189,0.2))", border: "1px solid rgba(224,48,48,0.3)" }}>
        <div className="flex items-center gap-2 mb-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1">
            <path d={icons.star} />
          </svg>
          <span className="text-yellow-400 text-xs font-bold">UPGRADE PRO</span>
        </div>
        <p className="text-gray-400 text-xs mb-2">Unlock semua fitur premium!</p>
        <button className="w-full py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:brightness-110"
          style={{ background: "linear-gradient(135deg,#e03030,#a00020)" }}>
          Upgrade Sekarang
        </button>
      </div>
    )}

    {/* Logout */}
    <button
      onClick={onLogout}
      className="flex items-center gap-3 px-4 py-4 border-t border-white/5 text-gray-600 hover:text-red-400 transition-colors"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M16 17l5-5-5-5" />
        <path d="M21 12H9" />
      </svg>
      {!collapsed && <span className="text-sm font-medium">Logout</span>}
    </button>
  </aside>
);

/* ══════════════════════════════════════════
   WORKOUT PROGRAM CARD
══════════════════════════════════════════ */
const ProgramCard = ({ program }) => (
  <div className="rounded-2xl p-5 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-2xl"
    style={{
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${program.color}30`,
      boxShadow: `0 4px 24px ${program.color}10`,
    }}>
    <div className="flex items-center gap-3 mb-3">
      <div className="w-3 h-3 rounded-full" style={{ background: program.color, boxShadow: `0 0 8px ${program.color}` }} />
      <h3 className="font-bold text-lg" style={{ color: program.color }}>{program.title}</h3>
    </div>
    <p className="text-gray-400 text-sm leading-relaxed mb-4">{program.desc}</p>
    <div className="flex flex-wrap gap-2">
      {program.tags.map(tag => (
        <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium"
          style={{ background: `${program.color}15`, color: program.color, border: `1px solid ${program.color}30` }}>
          {tag}
        </span>
      ))}
    </div>
    <button className="mt-4 w-full py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all hover:brightness-110 hover:scale-[1.02]"
      style={{ background: `linear-gradient(135deg, ${program.color}, ${program.color}88)`, color: "#fff" }}>
      Mulai Program
    </button>
  </div>
);

/* ══════════════════════════════════════════
   VIDEO CARD
══════════════════════════════════════════ */
const VideoCard = ({ video }) => (
  <div className="rounded-2xl overflow-hidden transition-all duration-300 hover:translate-y-[-2px]"
    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
    {/* Thumbnail */}
    <div className="relative h-36 flex items-center justify-center text-5xl"
      style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}>
      <span>{video.thumb}</span>
      {video.locked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
            <path d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="text-yellow-400 text-xs font-bold mt-1">PREMIUM</span>
        </div>
      )}
      {!video.locked && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
          style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: "rgba(224,48,48,0.9)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
        </div>
      )}
    </div>
    {/* Info */}
    <div className="p-4">
      <h4 className="text-white text-sm font-semibold mb-2">{video.title}</h4>
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span>⏱ {video.duration}</span>
        <span className="px-2 py-0.5 rounded-full"
          style={{
            background: video.level === "Beginner" ? "rgba(34,197,94,0.15)" : video.level === "Intermediate" ? "rgba(251,191,36,0.15)" : "rgba(239,68,68,0.15)",
            color: video.level === "Beginner" ? "#4ade80" : video.level === "Intermediate" ? "#fbbf24" : "#f87171",
          }}>
          {video.level}
        </span>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════
   PAGE CONTENT
══════════════════════════════════════════ */
const HomeContent = ({ user }) => (
  <div>
    {/* Welcome Banner */}
    <div className="rounded-2xl p-6 mb-6 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #c0001a 0%, #6b1a6b 50%, #1a4fa0 100%)" }}>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-8xl opacity-20">🏋️</div>
      <h2 className="text-2xl font-black text-white mb-1">
        Selamat datang, {user?.name || "Athlete"}! 💪
      </h2>
      <p className="text-white/70 text-sm">Hari ini adalah hari yang tepat untuk berolahraga!</p>
      <button className="mt-4 px-6 py-2.5 rounded-xl text-sm font-bold bg-white text-red-600 hover:bg-gray-100 transition-all">
        Mulai Workout Hari Ini
      </button>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {[
        { label: "Workout", value: "0", unit: "sesi", color: "#e03030", icon: "🔥" },
        { label: "Kalori", value: "0", unit: "kcal", color: "#1a6ebd", icon: "⚡" },
        { label: "Streak", value: "0", unit: "hari", color: "#8b1a8b", icon: "📅" },
        { label: "Goal", value: "0%", unit: "tercapai", color: "#16a34a", icon: "🎯" },
      ].map(stat => (
        <div key={stat.label} className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${stat.color}20` }}>
          <div className="text-2xl mb-1">{stat.icon}</div>
          <div className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</div>
          <div className="text-gray-500 text-xs">{stat.unit}</div>
          <div className="text-gray-400 text-xs mt-1">{stat.label}</div>
        </div>
      ))}
    </div>

    {/* Workout Programs Preview */}
    <h3 className="text-white font-bold text-lg mb-4">🏋️ Workout Program</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {workoutPrograms.map(p => <ProgramCard key={p.title} program={p} />)}
    </div>

    {/* Video Preview */}
    <h3 className="text-white font-bold text-lg mb-4">🎬 Workout Video</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {videos.map(v => <VideoCard key={v.title} video={v} />)}
    </div>
  </div>
);

const WorkoutContent = () => (
  <div>
    <h2 className="text-white text-2xl font-black mb-2">Workout Program</h2>
    <p className="text-gray-500 text-sm mb-6">Pilih program yang sesuai dengan tujuan fitness kamu</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {workoutPrograms.map(p => <ProgramCard key={p.title} program={p} />)}
    </div>
  </div>
);

const VideoContent = () => (
  <div>
    <h2 className="text-white text-2xl font-black mb-2">Workout Video</h2>
    <p className="text-gray-500 text-sm mb-6">Ikuti video latihan untuk memandu workout kamu</p>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {videos.map(v => <VideoCard key={v.title} video={v} />)}
    </div>
    <div className="mt-6 p-5 rounded-2xl text-center"
      style={{ background: "linear-gradient(135deg, rgba(224,48,48,0.1), rgba(26,110,189,0.1))", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="text-4xl mb-2">🔒</div>
      <h3 className="text-white font-bold mb-1">Unlock Semua Video</h3>
      <p className="text-gray-500 text-sm mb-4">Upgrade ke Premium untuk akses 50+ video workout</p>
      <button className="px-8 py-3 rounded-xl font-bold text-white text-sm transition-all hover:brightness-110"
        style={{ background: "linear-gradient(135deg,#e03030,#a00020)" }}>
        ⭐ Upgrade Premium
      </button>
    </div>
  </div>
);

const NutritionContent = () => (
  <div>
    <h2 className="text-white text-2xl font-black mb-2">Nutrition</h2>
    <p className="text-gray-500 text-sm mb-6">Panduan nutrisi untuk mendukung program fitness kamu</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {[
        { title: "Protein", desc: "Kebutuhan protein harian untuk membangun otot dan pemulihan", amount: "1.6-2.2g/kg BB", color: "#e03030", emoji: "🥩" },
        { title: "Karbohidrat", desc: "Sumber energi utama untuk performa workout yang optimal", amount: "4-7g/kg BB", color: "#1a6ebd", emoji: "🍚" },
        { title: "Lemak Sehat", desc: "Penting untuk hormon dan penyerapan vitamin", amount: "0.8-1g/kg BB", color: "#8b1a8b", emoji: "🥑" },
        { title: "Hidrasi", desc: "Menjaga performa dan pemulihan yang optimal", amount: "2-3L per hari", color: "#16a34a", emoji: "💧" },
      ].map(n => (
        <div key={n.title} className="rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${n.color}25` }}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{n.emoji}</span>
            <div>
              <h3 className="font-bold text-lg" style={{ color: n.color }}>{n.title}</h3>
              <span className="text-xs font-mono" style={{ color: n.color }}>{n.amount}</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm">{n.desc}</p>
        </div>
      ))}
    </div>
    <div className="mt-5 p-5 rounded-2xl text-center"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="text-3xl mb-2">🔒</div>
      <p className="text-gray-400 text-sm mb-3">Meal plan harian & kalkulasi kalori tersedia di Premium</p>
      <button className="px-6 py-2.5 rounded-xl font-bold text-white text-sm"
        style={{ background: "linear-gradient(135deg,#e03030,#a00020)" }}>
        ⭐ Upgrade Premium
      </button>
    </div>
  </div>
);

const BMIContent = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);

  const calcBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) setBmi((w / (h * h)).toFixed(1));
  };

  const getCategory = (b) => {
    if (b < 18.5) return { label: "Underweight", color: "#3b82f6" };
    if (b < 25) return { label: "Normal", color: "#22c55e" };
    if (b < 30) return { label: "Overweight", color: "#f59e0b" };
    return { label: "Obesitas", color: "#ef4444" };
  };

  const cat = bmi ? getCategory(parseFloat(bmi)) : null;

  return (
    <div>
      <h2 className="text-white text-2xl font-black mb-2">BMI Calculator</h2>
      <p className="text-gray-500 text-sm mb-6">Hitung Body Mass Index kamu untuk mengetahui kondisi berat badan</p>
      <div className="max-w-md mx-auto">
        <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="mb-4">
            <label className="text-gray-400 text-sm block mb-2">Tinggi Badan (cm)</label>
            <input type="number" placeholder="contoh: 170" value={height}
              onChange={e => setHeight(e.target.value)}
              className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors" />
          </div>
          <div className="mb-6">
            <label className="text-gray-400 text-sm block mb-2">Berat Badan (kg)</label>
            <input type="number" placeholder="contoh: 65" value={weight}
              onChange={e => setWeight(e.target.value)}
              className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors" />
          </div>
          <button onClick={calcBMI}
            className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg,#e03030,#a00020)" }}>
            Hitung BMI
          </button>

          {bmi && cat && (
            <div className="mt-6 text-center">
              <div className="text-6xl font-black mb-2" style={{ color: cat.color }}>{bmi}</div>
              <div className="inline-block px-4 py-1 rounded-full text-sm font-bold mb-3"
                style={{ background: `${cat.color}20`, color: cat.color }}>
                {cat.label}
              </div>
              <div className="grid grid-cols-4 gap-1 mt-4">
                {[
                  { r: "< 18.5", l: "Underweight", c: "#3b82f6" },
                  { r: "18.5-24.9", l: "Normal", c: "#22c55e" },
                  { r: "25-29.9", l: "Overweight", c: "#f59e0b" },
                  { r: "≥ 30", l: "Obesitas", c: "#ef4444" },
                ].map(item => (
                  <div key={item.l} className="rounded-lg p-2 text-center"
                    style={{ background: `${item.c}10`, border: `1px solid ${item.c}30` }}>
                    <div className="text-xs font-bold" style={{ color: item.c }}>{item.r}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LockedPage = ({ title, emoji }) => (
  <div className="flex flex-col items-center justify-center h-96 text-center">
    <div className="text-6xl mb-4">{emoji}</div>
    <h2 className="text-white text-2xl font-black mb-2">{title}</h2>
    <p className="text-gray-500 text-sm mb-6 max-w-sm">
      Fitur ini tersedia untuk pengguna Premium. Upgrade sekarang untuk akses penuh!
    </p>
    <button className="px-8 py-3 rounded-xl font-bold text-white transition-all hover:brightness-110"
      style={{ background: "linear-gradient(135deg,#e03030,#a00020)" }}>
      ⭐ Upgrade ke Premium
    </button>
  </div>
);

/* ══════════════════════════════════════════
   PROFILE CONTENT
══════════════════════════════════════════ */
const ProfileContent = ({ onLogout }) => {
  const user = JSON.parse(localStorage.getItem("fitinUser") || "{}");
  const initial = (user?.name || "A")[0].toUpperCase();

  const InfoRow = ({ label, value, icon }) => (
    <div className="flex items-center gap-4 p-4 rounded-xl transition-all"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{ background: "rgba(224,48,48,0.1)" }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-500 text-xs mb-0.5">{label}</p>
        <p className="text-white font-semibold text-sm truncate">{value || "-"}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-white text-2xl font-black mb-2">Profile</h2>
      <p className="text-gray-500 text-sm mb-6">Informasi akun kamu</p>

      {/* Avatar & Name */}
      <div className="rounded-2xl p-6 mb-5 flex flex-col items-center text-center"
        style={{
          background: "linear-gradient(135deg, rgba(224,48,48,0.12), rgba(26,110,189,0.12))",
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black text-white mb-4"
          style={{
            background: "linear-gradient(135deg, #e03030, #cc44cc, #1a6ebd)",
            boxShadow: "0 0 32px rgba(224,48,48,0.4)",
          }}>
          {initial}
        </div>
        <h3 className="text-white text-xl font-black mb-1">{user?.name || "Athlete"}</h3>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)" }}>
          FREE MEMBER
        </span>
      </div>

      {/* Info Cards */}
      <div className="flex flex-col gap-3 mb-5">
        <InfoRow label="Username" value={user?.name} icon="👤" />
        <InfoRow label="Email" value={user?.email} icon="📧" />
        <InfoRow label="Member Sejak" value={
          user?.created_at
            ? new Date(user.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
            : new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
        } icon="📅" />
        <InfoRow label="Status Akun" value="Aktif ✓" icon="🛡️" />
      </div>

      {/* Upgrade Banner */}
      <div className="rounded-2xl p-5 mb-5 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(224,48,48,0.15), rgba(26,110,189,0.15))",
          border: "1px solid rgba(224,48,48,0.25)",
        }}>
        <div className="text-3xl mb-2">⭐</div>
        <h4 className="text-white font-bold mb-1">Upgrade ke Premium</h4>
        <p className="text-gray-500 text-xs mb-4">
          Unlock semua fitur: Progress, Schedule, 50+ Video, dan Meal Plan!
        </p>
        <button className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all hover:brightness-110"
          style={{ background: "linear-gradient(135deg,#e03030,#a00020)" }}>
          Upgrade Sekarang
        </button>
      </div>

      {/* Logout */}
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

/* ══════════════════════════════════════════
   UPGRADE POPUP
══════════════════════════════════════════ */
const UpgradePopup = ({ onClose, onUpgrade }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}>
    <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
      style={{ background: "#fff", maxHeight: "90vh", overflowY: "auto" }}>

      {/* Close Button */}
      <button onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all z-10"
        style={{ border: "1px solid #e5e7eb" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="p-8 text-center">
        <h2 className="text-2xl font-black mb-3 uppercase tracking-wide italic"
          style={{
            background: "linear-gradient(135deg, #e03030, #cc44cc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
          UPGRADE KE FIT-IN PREMIUM
        </h2>

        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Ambil kendali penuh atas transformasi tubuhmu dengan fitur eksklusif yang
          dirancang khusus untuk hasil yang lebih terarah dan maksimal.
        </p>

        <div className="flex flex-col gap-3 mb-7">
          {[
            { title: "Pilih Fokus Program Sesuai Tujuanmu", desc: "Tentukan jalur fitness kamu: Bulking untuk membangun otot, Cutting untuk mengurangi lemak, atau Maintenance untuk menjaga bentuk ideal." },
            { title: "Workout Planner Otomatis", desc: "Dapatkan jadwal latihan yang langsung disesuaikan dengan durasi langgananmu, tanpa ribet, tanpa bingung." },
            { title: "Video Workout Terarah", desc: "Ikuti video latihan yang sudah disusun sesuai planner, jadi kamu tahu persis apa yang harus dilakukan setiap hari." },
            { title: "Pantau Progress Secara Real-Time", desc: "Lihat perkembangan workout kamu dengan tampilan visual yang memotivasi dan mudah dipahami." },
            { title: "Kontrol Nutrisi Lebih Akurat", desc: "Hitung dan atur kebutuhan kalori, gula, dan protein sesuai target tubuhmu — semua dalam satu platform." },
          ].map((f, i) => (
            <div key={i} className="rounded-2xl px-5 py-3 text-left"
              style={{ background: "linear-gradient(135deg, #e03030, #c0001a)" }}>
              <p className="text-white font-bold text-sm italic">{f.title}</p>
              <p className="text-red-100 text-xs mt-1 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onUpgrade}
          className="w-full py-4 rounded-2xl font-black text-gray-700 text-base tracking-wide transition-all hover:brightness-95 hover:scale-[1.02] active:scale-95"
          style={{ background: "linear-gradient(135deg, #f3f4f6, #e5e7eb)", border: "2px solid #d1d5db" }}>
          Klik disini untuk Upgrade
        </button>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════ */
export default function Dashboard({ onLogout, onNavigate }) {
  const [active, setActive] = useState("home");
  const [collapsed, setCollapsed] = useState(false);
  const [showPopup, setShowPopup] = useState(true);

  const user = JSON.parse(localStorage.getItem("fitinUser") || '{"name":"Athlete"}');

  const handleUpgrade = () => {
    setShowPopup(false);
    onNavigate("payment");
  };

  const renderContent = () => {
    switch (active) {
      case "home": return <HomeContent user={user} />;
      case "workout": return <WorkoutContent />;
      case "video": return <VideoContent />;
      case "nutrition": return <NutritionContent />;
      case "bmi": return <BMIContent />;
      case "progress": return <LockedPage title="Progress Tracking" emoji="📊" />;
      case "schedule": return <LockedPage title="Workout Schedule" emoji="📅" />;
      case "profile": return <ProfileContent onLogout={onLogout} />;
      default: return <HomeContent user={user} />;
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

      <Sidebar
        active={active}
        setActive={setActive}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        onLogout={onLogout}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4"
          style={{ background: "rgba(10,10,10,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <h1 className="text-white font-bold text-lg capitalize">
            {navItems.find(n => n.key === active)?.label || "Dashboard"}
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setShowPopup(false); onNavigate("payment"); }}
              className="px-4 py-2 rounded-lg text-xs font-bold text-yellow-400 transition-all hover:brightness-110"
              style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)" }}>
              ⭐ Upgrade
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ background: "linear-gradient(135deg,#e03030,#1a6ebd)" }}>
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
          </div>
        </div>
        <div className="p-6">{renderContent()}</div>
      </main>
    </div>
  );
}
