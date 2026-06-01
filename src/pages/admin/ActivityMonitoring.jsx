import React, { useEffect, useState, useRef } from "react";

const API = "http://127.0.0.1:8000/api/admin";

const ACTIVITY_META = {
  login: { icon: "🔑", label: "Login", color: "#a78bfa" },
  register: { icon: "✨", label: "Register", color: "#34d399" },
  workout_done: { icon: "💪", label: "Workout Selesai", color: "#fb923c" },
  upgrade_premium: { icon: "⭐", label: "Upgrade Premium", color: "#fbbf24" },
  logout: { icon: "🚪", label: "Logout", color: "#64748b" },
};

const roleColor = (role) => {
  if (role === "admin") return "#e03030";
  if (role === "premium") return "#06b6d4";
  return "#475569";
};

export default function ActivityMonitoring() {
  const [activities, setActivities] = useState([]);
  const [stats, setStats]           = useState({ today_logins: 0, today_workouts: 0, new_registers: 0, total_activities: 0 });
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState("all");
  const [search, setSearch]         = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const intervalRef = useRef(null);

  const fetchData = () => {
    Promise.all([
      fetch(`${API}/activities`).then(r => r.json()),
      fetch(`${API}/activities/stats`).then(r => r.json()),
    ]).then(([acts, st]) => {
      setActivities(acts);
      setStats(st);
      setLastUpdate(new Date());
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchData, 10000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [autoRefresh]);

  const filtered = activities.filter(a => {
    const matchFilter = filter === "all" || a.activity === filter;
    const matchSearch = a.user_name.toLowerCase().includes(search.toLowerCase()) ||
                        a.user_email.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const StatMini = ({ label, value, color }) => (
    <div style={{
      background: "rgba(15,15,25,0.8)", border: `1px solid ${color}25`,
      borderRadius: 16, padding: "20px 22px", flex: 1, minWidth: 140,
    }}>
      <p style={{ color: "#555", fontSize: 12, margin: "0 0 8px", letterSpacing: 0.5 }}>{label}</p>
      <h3 style={{ color, fontSize: 32, fontWeight: 800, margin: 0 }}>{value}</h3>
    </div>
  );

  return (
    <div style={{ padding: "40px", minHeight: "100vh", color: "white", fontFamily: "'Poppins', sans-serif" }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h1 style={{
            fontSize: 34, fontWeight: 800, margin: 0,
            background: "linear-gradient(90deg, #a78bfa, #06b6d4)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Monitoring Activity</h1>
          <p style={{ color: "#555", fontSize: 14, marginTop: 6 }}>
            {lastUpdate ? `Update terakhir: ${lastUpdate.toLocaleTimeString("id-ID")}` : "Memuat data..."}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {/* Auto Refresh Toggle */}
          <button onClick={() => setAutoRefresh(!autoRefresh)} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 18px", borderRadius: 12,
            border: `1px solid ${autoRefresh ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.08)"}`,
            background: autoRefresh ? "rgba(52,211,153,0.1)" : "transparent",
            color: autoRefresh ? "#34d399" : "#555", cursor: "pointer", fontSize: 13, fontWeight: 600,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: autoRefresh ? "#34d399" : "#555",
              animation: autoRefresh ? "pulse 1.5s infinite" : "none",
              display: "inline-block",
            }} />
            {autoRefresh ? "Live" : "Paused"}
          </button>

          <button onClick={fetchData} style={{
            padding: "10px 18px", borderRadius: 12,
            border: "1px solid rgba(167,139,250,0.3)", background: "rgba(167,139,250,0.1)",
            color: "#a78bfa", cursor: "pointer", fontSize: 13, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>
      <div style={{ height: 1, background: "linear-gradient(90deg, #a78bfa, transparent)", marginBottom: 28, opacity: 0.3 }} />

      {/* STATS MINI */}
      <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
        <StatMini label="Total Aktivitas"      value={stats.total_activities} color="#a78bfa" />
        <StatMini label="Login Hari Ini"       value={stats.today_logins}     color="#38bdf8" />
        <StatMini label="Register Hari Ini"    value={stats.new_registers}    color="#34d399" />
        <StatMini label="Workout Hari Ini"     value={stats.today_workouts}   color="#fb923c" />
      </div>

      {/* FILTER TABS */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { key: "all", label: "Semua" },
          ...Object.entries(ACTIVITY_META).map(([key, v]) => ({ key, label: v.label }))
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding: "7px 16px", borderRadius: 30, cursor: "pointer", fontSize: 12, fontWeight: 600,
            border: `1px solid ${filter === f.key ? "#a78bfa" : "rgba(255,255,255,0.07)"}`,
            background: filter === f.key ? "rgba(167,139,250,0.15)" : "transparent",
            color: filter === f.key ? "#a78bfa" : "#555", transition: "all 0.2s",
          }}>{f.label}</button>
        ))}
      </div>

      {/* SEARCH */}
      <div style={{ position: "relative", marginBottom: 24, maxWidth: 360 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"
          style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Cari nama atau email user..."
          style={{
            width: "100%", padding: "11px 14px 11px 38px", borderRadius: 12,
            background: "rgba(15,15,25,0.8)", border: "1px solid rgba(255,255,255,0.08)",
            color: "white", fontSize: 13, outline: "none", boxSizing: "border-box",
          }}
        />
      </div>

      {/* ACTIVITY LIST */}
      <div style={{
        background: "rgba(15,15,25,0.8)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 20, overflow: "hidden", backdropFilter: "blur(12px)",
      }}>

        {/* Table Header */}
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
          padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
          {["USER", "AKTIVITAS", "ROLE", "IP ADDRESS", "WAKTU"].map(h => (
            <span key={h} style={{ color: "#444", fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: "#555" }}>
            <div style={{ width: 32, height: 32, border: "3px solid #a78bfa", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
            Memuat aktivitas...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
            <p style={{ color: "#555" }}>Belum ada aktivitas tercatat</p>
            <p style={{ color: "#333", fontSize: 12 }}>Aktivitas akan muncul setelah user login, register, atau workout</p>
          </div>
        ) : (
          filtered.map((act, i) => {
            const meta = ACTIVITY_META[act.activity] || { icon: "📌", label: act.activity, color: "#94a3b8" };
            return (
              <div key={act.id || i} style={{
                display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
                padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.03)",
                alignItems: "center", transition: "background 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                {/* User */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "linear-gradient(135deg,#e03030,#1a6ebd)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, color: "white", flexShrink: 0,
                  }}>{(act.user_name || "?").charAt(0).toUpperCase()}</div>
                  <div>
                    <p style={{ color: "#ddd", fontSize: 13, fontWeight: 600, margin: 0 }}>{act.user_name}</p>
                    <p style={{ color: "#444", fontSize: 11, margin: 0 }}>{act.user_email}</p>
                  </div>
                </div>

                {/* Aktivitas */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span>{meta.icon}</span>
                  <span style={{ color: meta.color, fontSize: 12, fontWeight: 600 }}>{meta.label}</span>
                </div>

                {/* Role */}
                <span style={{
                  padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, display: "inline-block",
                  background: `${roleColor(act.user_role)}15`, color: roleColor(act.user_role),
                  border: `1px solid ${roleColor(act.user_role)}30`,
                }}>{act.user_role || "free"}</span>

                {/* IP */}
                <span style={{ color: "#444", fontSize: 12 }}>{act.ip_address || "-"}</span>

                {/* Waktu */}
                <span style={{ color: "#555", fontSize: 12 }}>{act.time}</span>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        input::placeholder { color: #555; }
      `}</style>
    </div>
  );
}