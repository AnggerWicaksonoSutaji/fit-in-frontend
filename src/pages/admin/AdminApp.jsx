import React, { useState } from "react";
import AdminDashboard from "./AdminDashboard";
import UsersManagement from "./UsersManagement";
import WorkoutManagement from "./WorkoutManagement";
import ActivityMonitoring from "./ActivityMonitoring";

const NAV = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    key: "users",
    label: "User Management",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    key: "workouts",
    label: "Workout Management",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 6.5h11" /><path d="M6.5 17.5h11" />
        <path d="M3 10h2.5" /><path d="M18.5 10H21" />
        <path d="M3 14h2.5" /><path d="M18.5 14H21" />
        <rect x="5.5" y="8" width="13" height="8" rx="2" />
      </svg>
    ),
  },
  {
    key: "activity",
    label: "Monitoring Activity",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];

// Ambil nama admin dari localStorage
const getAdminName = () => {
  try {
    const user = JSON.parse(localStorage.getItem("fitinUser") || "{}");
    return user.name || "Admin";
  } catch {
    return "Admin";
  }
};

export default function AdminApp({ onLogout }) {
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const renderPage = () => {
    switch (active) {
      case "dashboard": return <AdminDashboard />;
      case "users":     return <UsersManagement />;
      case "workouts":  return <WorkoutManagement />;
      case "activity":  return <ActivityMonitoring />;
      default:          return <AdminDashboard />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#080810", fontFamily: "'Poppins', sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: collapsed ? 70 : 240,
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0f0f0f 0%, #1a0a0a 50%, #0a0a1a 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s ease",
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}>

        {/* Logo */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg,#e03030,#1a6ebd)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{ color: "white", fontWeight: 900, fontSize: 13 }}>FI</span>
          </div>
          {!collapsed && (
            <span style={{
              fontWeight: 900, fontSize: 16, letterSpacing: 4,
              background: "linear-gradient(90deg,#e03030,#cc44cc,#1a6ebd)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>FIT-IN</span>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={{
            marginLeft: "auto", background: "none", border: "none",
            color: "#555", cursor: "pointer", padding: 4,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {collapsed
                ? <><path d="M3 12h18"/><path d="M3 6h18"/><path d="M3 18h18"/></>
                : <><path d="M18 6L6 18"/><path d="M6 6l12 12"/></>
              }
            </svg>
          </button>
        </div>

        {/* Admin info */}
        {!collapsed && (
          <div style={{ padding: "14px 16px 4px" }}>
            <div style={{
              background: "rgba(224,48,48,0.08)", border: "1px solid rgba(224,48,48,0.2)",
              borderRadius: 10, padding: "8px 12px",
            }}>
              <div style={{ color: "#e03030", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 2 }}>
                ● ADMIN PANEL
              </div>
              <div style={{ color: "#888", fontSize: 12 }}>{getAdminName()}</div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, paddingTop: 12 }}>
          {NAV.map((item) => {
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                style={{
                  width: "100%", display: "flex", alignItems: "center",
                  gap: 12, padding: "12px 16px",
                  background: isActive
                    ? "linear-gradient(90deg, rgba(224,48,48,0.15), transparent)"
                    : "transparent",
                  border: "none", cursor: "pointer",
                  color: isActive ? "#fff" : "#555",
                  position: "relative", transition: "all 0.2s",
                  textAlign: "left",
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = "#aaa"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = "#555"; }}
              >
                {isActive && (
                  <span style={{
                    position: "absolute", left: 0, top: "50%",
                    transform: "translateY(-50%)",
                    width: 3, height: 32, borderRadius: "0 4px 4px 0",
                    background: "linear-gradient(180deg,#e03030,#cc44cc)",
                  }} />
                )}
                <span style={{ color: isActive ? "#e03030" : "inherit", flexShrink: 0 }}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, letterSpacing: 0.3 }}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={onLogout}
          style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "16px", borderTop: "1px solid rgba(255,255,255,0.05)",
            background: "none", border: "none", borderTop: "1px solid rgba(255,255,255,0.05)",
            color: "#555", cursor: "pointer", transition: "color 0.2s", width: "100%",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#e03030"}
          onMouseLeave={e => e.currentTarget.style.color = "#555"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {!collapsed && <span style={{ fontSize: 13, fontWeight: 500 }}>Logout</span>}
        </button>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, overflow: "auto" }}>
        {renderPage()}
      </main>
    </div>
  );
}