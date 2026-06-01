import React, { useEffect, useState } from "react";

const API = "http://127.0.0.1:8001/api/admin";

const StatCard = ({ label, value, color, icon, sub }) => (
  <div
    style={{
      background: "rgba(15,15,25,0.8)",
      border: `1px solid ${color}30`,
      borderRadius: 20,
      padding: "28px 24px",
      backdropFilter: "blur(12px)",
      boxShadow: `0 0 30px ${color}10`,
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "default",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = "translateY(-3px)";
      e.currentTarget.style.boxShadow = `0 8px 40px ${color}20`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = `0 0 30px ${color}10`;
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <p style={{ color: "#666", fontSize: 13, marginBottom: 8, letterSpacing: 0.5 }}>{label}</p>
        <h2 style={{ fontSize: 44, fontWeight: 800, color, margin: 0, lineHeight: 1 }}>{value}</h2>
        {sub && <p style={{ color: "#444", fontSize: 12, marginTop: 6 }}>{sub}</p>}
      </div>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: `${color}15`, border: `1px solid ${color}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color,
      }}>
        {icon}
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [data, setData] = useState({
    total_users: 0, premium_users: 0, free_users: 0,
    admin_users: 0, workout_programs: 0,
    total_workouts_done: 0, total_transactions: 0,
  });
  const [actStats, setActStats] = useState({
    today_logins: 0, today_workouts: 0,
    new_registers: 0, recent_activities: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchAll = () => {
    Promise.all([
      fetch(`${API}/dashboard`).then(r => r.json()).catch(() => ({})),
      fetch(`${API}/activities/stats`).then(r => r.json()).catch(() => ({ today_logins: 0, today_workouts: 0, new_registers: 0, recent_activities: [] })),
    ]).then(([dash, stats]) => {
      setData(prev => ({ ...prev, ...dash }));
      setActStats(prev => ({ ...prev, ...stats }));
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 15000);
    return () => clearInterval(interval);
  }, []);

  const activityIcon = (type) => {
    const icons = { login: "🔑", register: "✨", workout_done: "💪", upgrade_premium: "⭐", logout: "🚪" };
    return icons[type] || "📌";
  };

  const roleColor = (role) => {
    if (role === "admin") return "#e03030";
    if (role === "premium") return "#06b6d4";
    return "#475569";
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#e03030" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #e03030", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
        <p>Loading dashboard...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ padding: "40px", minHeight: "100vh", color: "white" }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 38, fontWeight: 800, margin: 0, background: "linear-gradient(90deg, #e03030, #cc44cc, #1a6ebd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Dashboard Analytics
            </h1>
            <p style={{ color: "#555", fontSize: 14, marginTop: 6 }}>Realtime overview — FIT-IN System</p>
          </div>
          <button onClick={fetchAll} style={{ background: "rgba(224,48,48,0.1)", border: "1px solid rgba(224,48,48,0.3)", color: "#e03030", borderRadius: 12, padding: "10px 20px", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            Refresh
          </button>
        </div>
        <div style={{ height: 1, background: "linear-gradient(90deg, #e03030, transparent)", marginTop: 20, opacity: 0.3 }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 24 }}>
        <StatCard label="Total Users" value={data.total_users} color="#38bdf8"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
          sub={`${data.free_users} free · ${data.admin_users} admin`}
        />
        <StatCard label="Premium Users" value={data.premium_users} color="#06b6d4"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
          sub={`${data.total_transactions} transaksi lunas`}
        />
        <StatCard label="Exercise Library" value={data.workout_programs} color="#e03030"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/><path d="M3 10h2.5"/><path d="M18.5 10H21"/><path d="M3 14h2.5"/><path d="M18.5 14H21"/><rect x="5.5" y="8" width="13" height="8" rx="2"/></svg>}
          sub={`${data.total_workouts_done} workout selesai`}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20, marginBottom: 36 }}>
        <StatCard label="Login Hari Ini" value={actStats.today_logins} color="#a78bfa"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>}
        />
        <StatCard label="Register Hari Ini" value={actStats.new_registers} color="#34d399"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>}
        />
        <StatCard label="Workout Selesai" value={actStats.today_workouts} color="#fb923c"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
        />
      </div>

      <div style={{ background: "rgba(15,15,25,0.8)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 28, backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ color: "#e03030", fontSize: 18, fontWeight: 700, margin: 0 }}>Aktivitas Terbaru</h2>
          <span style={{ background: "rgba(224,48,48,0.1)", border: "1px solid rgba(224,48,48,0.2)", color: "#e03030", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>● LIVE</span>
        </div>
        {!actStats.recent_activities || actStats.recent_activities.length === 0 ? (
          <p style={{ color: "#444", textAlign: "center", padding: 20 }}>Belum ada aktivitas tercatat</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {actStats.recent_activities.map((act, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize: 20 }}>{activityIcon(act.activity)}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ color: "#ddd", fontWeight: 600, fontSize: 14 }}>{act.user}</span>
                  <span style={{ color: "#555", fontSize: 13, marginLeft: 8 }}>{act.activity.replace(/_/g, " ")}</span>
                </div>
                <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: `${roleColor(act.role)}20`, color: roleColor(act.role) }}>{act.role}</span>
                <span style={{ color: "#444", fontSize: 12 }}>{act.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}