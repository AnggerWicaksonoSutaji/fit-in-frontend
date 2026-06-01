import React, { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000/api/admin";

const roleColor = (role) => {
  if (role === "admin")   return { bg: "rgba(224,48,48,0.15)",  text: "#e03030",  border: "rgba(224,48,48,0.3)" };
  if (role === "premium") return { bg: "rgba(6,182,212,0.15)",  text: "#06b6d4",  border: "rgba(6,182,212,0.3)" };
  return                         { bg: "rgba(71,85,105,0.3)",   text: "#94a3b8",  border: "rgba(71,85,105,0.4)" };
};

export default function UsersManagement() {
  const [users, setUsers]       = useState([]);
  const [search, setSearch]     = useState("");
  const [loading, setLoading]   = useState(true);
  const [toast, setToast]       = useState(null);
  const [confirm, setConfirm]   = useState(null); // { id, name, action }
  const [filter, setFilter]     = useState("all");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = () => {
    fetch(`${API}/users`)
      .then(r => r.json())
      .then(d => { setUsers(d); setLoading(false); })
      .catch(() => { showToast("Gagal load users", "error"); setLoading(false); });
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = (id, action) => {
    const endpoint = `${API}/users/${id}/${action}`;
    fetch(endpoint, { method: "PATCH" })
      .then(r => r.json())
      .then(() => { showToast("Role berhasil diubah"); fetchUsers(); })
      .catch(() => showToast("Gagal ubah role", "error"));
    setConfirm(null);
  };

  const handleDelete = (id) => {
    fetch(`${API}/users/${id}`, { method: "DELETE" })
      .then(r => r.json())
      .then(() => { showToast("User berhasil dihapus"); fetchUsers(); })
      .catch(() => showToast("Gagal hapus user", "error"));
    setConfirm(null);
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || u.role === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all:     users.length,
    free:    users.filter(u => u.role === "free").length,
    premium: users.filter(u => u.role === "premium").length,
    admin:   users.filter(u => u.role === "admin").length,
  };

  return (
    <div style={{ padding: "40px", minHeight: "100vh", color: "white", fontFamily: "'Poppins', sans-serif" }}>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 999,
          background: toast.type === "success" ? "rgba(52,211,153,0.15)" : "rgba(224,48,48,0.15)",
          border: `1px solid ${toast.type === "success" ? "#34d399" : "#e03030"}`,
          color: toast.type === "success" ? "#34d399" : "#e03030",
          padding: "14px 22px", borderRadius: 14, fontWeight: 600, fontSize: 14,
          backdropFilter: "blur(12px)", animation: "slideIn 0.3s ease",
        }}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      {/* CONFIRM MODAL */}
      {confirm && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 998,
          backdropFilter: "blur(4px)",
        }}>
          <div style={{
            background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20, padding: 32, width: 380, textAlign: "center",
          }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>
              {confirm.action === "delete" ? "🗑️" : "🔄"}
            </div>
            <h3 style={{ color: "white", fontSize: 18, marginBottom: 8 }}>
              {confirm.action === "delete" ? "Hapus User?" : "Ubah Role?"}
            </h3>
            <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
              {confirm.action === "delete"
                ? `User "${confirm.name}" akan dihapus permanen.`
                : `Ubah role "${confirm.name}" menjadi ${confirm.action.replace("make-", "")}?`}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setConfirm(null)} style={{
                padding: "10px 24px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent", color: "#666", cursor: "pointer", fontSize: 14,
              }}>Batal</button>
              <button onClick={() => confirm.action === "delete" ? handleDelete(confirm.id) : handleRoleChange(confirm.id, confirm.action)}
                style={{
                  padding: "10px 24px", borderRadius: 12, border: "none",
                  background: confirm.action === "delete" ? "#e03030" : "#1a6ebd",
                  color: "white", cursor: "pointer", fontSize: 14, fontWeight: 600,
                }}>
                {confirm.action === "delete" ? "Hapus" : "Ubah"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontSize: 34, fontWeight: 800, margin: 0,
          background: "linear-gradient(90deg, #38bdf8, #1a6ebd)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>User Management</h1>
        <p style={{ color: "#555", fontSize: 14, marginTop: 6 }}>
          Kelola semua user FIT-IN — {users.length} total user terdaftar
        </p>
        <div style={{ height: 1, background: "linear-gradient(90deg, #38bdf8, transparent)", marginTop: 16, opacity: 0.3 }} />
      </div>

      {/* FILTER TABS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        {["all", "free", "premium", "admin"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "8px 18px", borderRadius: 30, border: "1px solid",
            borderColor: filter === f ? "#38bdf8" : "rgba(255,255,255,0.08)",
            background: filter === f ? "rgba(56,189,248,0.15)" : "transparent",
            color: filter === f ? "#38bdf8" : "#555",
            cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.2s",
          }}>
            {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <div style={{ position: "relative", marginBottom: 24, maxWidth: 400 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"
          style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari nama atau email..."
          style={{
            width: "100%", padding: "12px 14px 12px 40px", borderRadius: 12,
            background: "rgba(15,15,25,0.8)", border: "1px solid rgba(255,255,255,0.08)",
            color: "white", fontSize: 14, outline: "none", boxSizing: "border-box",
          }}
        />
      </div>

      {/* TABLE */}
      <div style={{
        background: "rgba(15,15,25,0.8)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 20, overflow: "hidden", backdropFilter: "blur(12px)",
      }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#555" }}>
            <div style={{ width: 36, height: 36, border: "3px solid #38bdf8", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
            Loading users...
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["ID", "Nama", "Email", "Role", "Bergabung", "Aksi"].map(h => (
                  <th key={h} style={{ padding: "16px 20px", textAlign: "left", color: "#555", fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 32, textAlign: "center", color: "#444" }}>Tidak ada user ditemukan</td></tr>
              ) : filtered.map((user, i) => {
                const rc = roleColor(user.role);
                return (
                  <tr key={user.id} style={{
                    borderBottom: "1px solid rgba(255,255,255,0.03)",
                    transition: "background 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "16px 20px", color: "#555", fontSize: 13 }}>#{user.id}</td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: "50%",
                          background: `linear-gradient(135deg, #e03030, #1a6ebd)`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 13, fontWeight: 700, color: "white", flexShrink: 0,
                        }}>{user.name.charAt(0).toUpperCase()}</div>
                        <span style={{ color: "#ddd", fontWeight: 600, fontSize: 14 }}>{user.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px", color: "#888", fontSize: 13 }}>{user.email}</td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{
                        padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                        background: rc.bg, color: rc.text, border: `1px solid ${rc.border}`,
                      }}>{user.role}</span>
                    </td>
                    <td style={{ padding: "16px 20px", color: "#555", fontSize: 12 }}>
                      {user.created_at ? new Date(user.created_at).toLocaleDateString("id-ID") : "-"}
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {user.role !== "admin" && (
                          <button onClick={() => setConfirm({ id: user.id, name: user.name, action: "make-admin" })}
                            title="Jadikan Admin"
                            style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(224,48,48,0.3)", background: "rgba(224,48,48,0.1)", color: "#e03030", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
                            Admin
                          </button>
                        )}
                        {user.role !== "premium" && (
                          <button onClick={() => setConfirm({ id: user.id, name: user.name, action: "make-premium" })}
                            title="Jadikan Premium"
                            style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(6,182,212,0.3)", background: "rgba(6,182,212,0.1)", color: "#06b6d4", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
                            Premium
                          </button>
                        )}
                        {user.role !== "free" && (
                          <button onClick={() => setConfirm({ id: user.id, name: user.name, action: "make-free" })}
                            title="Set ke Free"
                            style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(71,85,105,0.4)", background: "rgba(71,85,105,0.2)", color: "#94a3b8", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
                            Free
                          </button>
                        )}
                        <button onClick={() => setConfirm({ id: user.id, name: user.name, action: "delete" })}
                          title="Hapus User"
                          style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(224,48,48,0.2)", background: "transparent", color: "#e03030", cursor: "pointer" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        input::placeholder { color: #555; }
      `}</style>
    </div>
  );
}