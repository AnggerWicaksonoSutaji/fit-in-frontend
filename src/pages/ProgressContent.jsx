/**
 * ProgressContent.jsx
 * ─────────────────────────────────────────────────
 * Halaman "Progress Tracking" — data akumulatif + grafik bulanan.
 *
 * Props:
 *   - stats (object) : { workouts, calories, streak, ... }
 * ─────────────────────────────────────────────────
 */

import { useState } from "react";
import LockedPage from "../components/LockedPage";

// ── Helper: buat array 30 hari terakhir (yyyy-mm-dd) ──
const getLast30Days = () => {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
};

// ── Mini SVG Line Chart ──
const LineChart = ({ data, color, label, unit, maxVal }) => {
  const W = 100;
  const H = 60;
  const max = maxVal || Math.max(...data, 1);
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * W},${H - (v / max) * H}`)
    .join(" ");

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 80 }} preserveAspectRatio="none">
        {/* Area fill */}
        <defs>
          <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <polygon
          points={`0,${H} ${points} ${W},${H}`}
          fill={`url(#grad-${label})`}
        />
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Active dot on last point */}
        {data.length > 0 && (
          <circle
            cx={W}
            cy={H - (data[data.length - 1] / max) * H}
            r="2.5"
            fill={color}
            stroke="#111"
            strokeWidth="1"
          />
        )}
      </svg>
    </div>
  );
};

// ── Bar Chart Bulanan (30 hari) ──
const MonthlyBarChart = ({ days, history, metric, color }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const values = days.map(d => (history[d]?.[metric] || 0));
  const max = Math.max(...values, 1);

  return (
    <div className="relative">
      {/* Tooltip */}
      {hoveredIdx !== null && (
        <div
          className="absolute -top-9 z-10 px-2 py-1 rounded-lg text-xs font-bold text-white pointer-events-none"
          style={{
            left: `${(hoveredIdx / (days.length - 1)) * 100}%`,
            transform: "translateX(-50%)",
            background: color,
            boxShadow: `0 4px 12px ${color}60`,
          }}
        >
          {values[hoveredIdx]} {metric === "calories" ? "kcal" : metric === "sessions" ? "sesi" : "hari"}
        </div>
      )}

      {/* Bars */}
      <div className="flex items-end gap-[2px]" style={{ height: 80 }}>
        {days.map((d, i) => {
          const val = history[d]?.[metric] || 0;
          const hPct = max > 0 ? (val / max) * 100 : 0;
          const isToday = d === new Date().toISOString().slice(0, 10);
          return (
            <div
              key={d}
              className="flex-1 flex flex-col justify-end cursor-pointer"
              style={{ height: "100%" }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div
                className="w-full rounded-t-sm transition-all"
                style={{
                  height: `${Math.max(hPct, 2)}%`,
                  background: isToday
                    ? `linear-gradient(180deg, #fff, ${color})`
                    : hoveredIdx === i
                      ? color
                      : `${color}60`,
                  minHeight: 2,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* X axis labels: tampilkan hanya tiap 7 hari */}
      <div className="flex mt-1" style={{ gap: "2px" }}>
        {days.map((d, i) => (
          <div key={d} className="flex-1 text-center">
            {i % 7 === 0 ? (
              <span className="text-gray-600 text-[8px]">
                {new Date(d).getDate()}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

const ProgressContent = ({ stats: propStats, user, onNavigate }) => {
  const isPremium = localStorage.getItem("fitinPremium") === "true";
  if (!isPremium) return <LockedPage title="Progress Tracking" emoji="📊" onNavigate={onNavigate} />;

  const stats = propStats || { workouts: 0, calories: 0, streak: 0 };

  // Ambil daily history dari localStorage sesuai ID user
  const userId = user?.id || user?.email || user?.name || "guest";
  const rawHistory = localStorage.getItem(`fitinDailyHistory_${userId}`);
  const history = rawHistory ? JSON.parse(rawHistory) : {};

  const days = getLast30Days();

  // Data per hari untuk grafik
  const sessionsData = days.map(d => history[d]?.sessions || 0);
  const caloriesData = days.map(d => history[d]?.calories || 0);
  const streakData = days.map(d => history[d]?.streak || 0);

  // Nama bulan
  const monthName = new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  const statCards = [
    { label: "Total Workout", value: stats.workouts, unit: "sesi", icon: "🏋️", color: "#e03030", sparkData: sessionsData },
    { label: "Total Kalori", value: stats.calories, unit: "kcal", icon: "🔥", color: "#f97316", sparkData: caloriesData },
    { label: "Streak Saat Ini", value: stats.streak, unit: "hari", icon: "⚡", color: "#a855f7", sparkData: streakData },
    { label: "Sesi Hari Ini", value: stats.todaySessions || 0, unit: "sesi", icon: "📅", color: "#22c55e", sparkData: sessionsData },
  ];

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-6">
        <h2 className="text-white text-2xl font-black mb-1">📊 Progress Tracking</h2>
        <p className="text-gray-500 text-sm">Data akumulatif & grafik bulanan kamu</p>
      </div>

      {/* ── Stat Cards dengan Sparkline ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-4 flex flex-col justify-between"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${s.color}25`,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{s.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{s.label}</span>
            </div>
            <div>
              <p className="text-2xl font-black" style={{ color: s.color }}>
                {s.value.toLocaleString("id-ID")}
              </p>
              <p className="text-gray-600 text-xs">{s.unit}</p>
            </div>
            {/* Sparkline */}
            <div className="mt-2 opacity-70">
              <LineChart
                data={s.sparkData}
                color={s.color}
                label={s.label}
                unit={s.unit}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Grafik Bulanan (3 chart) ── */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-base">Grafik 30 Hari Terakhir</h3>
          <span className="text-gray-500 text-xs font-medium px-3 py-1 rounded-full bg-white/5">{monthName}</span>
        </div>

        {/* Sesi Workout */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#e03030" }} />
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Sesi Workout per Hari</span>
          </div>
          <MonthlyBarChart days={days} history={history} metric="sessions" color="#e03030" />
        </div>

        <div className="border-t border-white/5 my-4" />

        {/* Kalori */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#f97316" }} />
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Kalori Terbakar (kcal)</span>
          </div>
          <MonthlyBarChart days={days} history={history} metric="calories" color="#f97316" />
        </div>

        <div className="border-t border-white/5 my-4" />

        {/* Streak */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#a855f7" }} />
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Streak Harian</span>
          </div>
          <MonthlyBarChart days={days} history={history} metric="streak" color="#a855f7" />
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background: "#fff" }} />
          <span className="text-gray-600 text-[10px]">= Hari ini</span>
        </div>
      </div>

      {/* ── Summary Teks ── */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h4 className="text-white font-bold text-sm mb-3">📈 Ringkasan Pencapaian</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-3">
            <p className="text-red-400 text-xs font-semibold mb-1">🏋️ Konsistensi Workout</p>
            <p className="text-white text-sm">
              {stats.workouts > 0
                ? `Kamu sudah ${stats.workouts} sesi. Luar biasa!`
                : "Belum ada sesi. Yuk mulai workout!"}
            </p>
          </div>
          <div className="bg-orange-500/5 border border-orange-500/15 rounded-xl p-3">
            <p className="text-orange-400 text-xs font-semibold mb-1">🔥 Pembakaran Kalori</p>
            <p className="text-white text-sm">
              {stats.calories > 0
                ? `Total ${stats.calories.toLocaleString("id-ID")} kcal terbakar`
                : "Belum ada kalori terbakar."}
            </p>
          </div>
          <div className="bg-purple-500/5 border border-purple-500/15 rounded-xl p-3">
            <p className="text-purple-400 text-xs font-semibold mb-1">⚡ Streak Aktif</p>
            <p className="text-white text-sm">
              {stats.streak > 0
                ? `${stats.streak} hari berturut-turut! Jangan berhenti!`
                : "Mulai streak kamu hari ini!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressContent;
