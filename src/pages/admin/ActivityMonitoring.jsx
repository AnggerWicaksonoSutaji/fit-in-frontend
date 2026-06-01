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
  return (
    <div style={{ padding: "30px" }}>
      <h1>MONITORING AKTIVITAS USER</h1>

      <ul style={{ marginTop: "20px" }}>
        <li>User A menyelesaikan workout</li>
        <li>User B upgrade premium</li>
        <li>User C login</li>
      </ul>
    </div>
  );
}