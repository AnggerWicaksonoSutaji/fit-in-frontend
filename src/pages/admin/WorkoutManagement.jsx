import React, { useEffect, useState } from "react";

const API = "http://127.0.0.1:8001/api/admin";

const OTOT_LIST = ["Dada", "Bahu", "Paha", "Lengan", "Punggung", "Perut", "Kaki"];

const ototColor = (otot) => {
  const map = {
    Dada: "#e03030", Bahu: "#cc44cc", Paha: "#1a6ebd",
    Lengan: "#06b6d4", Punggung: "#f59e0b", Perut: "#34d399", Kaki: "#fb923c",
  };
  return map[otot] || "#94a3b8";
};

const EMPTY_FORM = { nama_latihan: "", otot: "Dada", video_latihan: "" };

export default function WorkoutManagement() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(false);
  const [editData, setEditData]   = useState(null); // null = tambah baru
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState(null);
  const [confirm, setConfirm]     = useState(null);
  const [filterOtot, setFilterOtot] = useState("all");
  const [search, setSearch]       = useState("");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchExercises = () => {
    fetch(`${API}/workouts`)
      .then(r => r.json())
      .then(d => { setExercises(d); setLoading(false); })
      .catch(() => { showToast("Gagal load data", "error"); setLoading(false); });
  };

  useEffect(() => { fetchExercises(); }, []);

  const openAdd = () => {
    setEditData(null);
    setForm(EMPTY_FORM);
    setModal(true);
  };

  const openEdit = (ex) => {
    setEditData(ex);
    setForm({ nama_latihan: ex.nama_latihan, otot: ex.otot, video_latihan: ex.video_latihan || "" });
    setModal(true);
  };

  const handleSave = () => {
    if (!form.nama_latihan.trim()) { showToast("Nama latihan wajib diisi", "error"); return; }
    setSaving(true);

    const url    = editData ? `${API}/workouts/${editData.id}` : `${API}/workouts`;
    const method = editData ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(r => r.json())
      .then(() => {
        showToast(editData ? "Exercise berhasil diupdate" : "Exercise berhasil ditambahkan");
        setModal(false);
        fetchExercises();
      })
      .catch(() => showToast("Gagal simpan data", "error"))
      .finally(() => setSaving(false));
  };

  const handleDelete = (id) => {
    fetch(`${API}/workouts/${id}`, { method: "DELETE" })
      .then(r => r.json())
      .then(() => { showToast("Exercise berhasil dihapus"); fetchExercises(); })
      .catch(() => showToast("Gagal hapus", "error"));
    setConfirm(null);
  };

  const filtered = exercises.filter(ex => {
    const matchSearch = ex.nama_latihan.toLowerCase().includes(search.toLowerCase());
    const matchOtot   = filterOtot === "all" || ex.otot === filterOtot;
    return matchSearch && matchOtot;
  });

  const grouped = OTOT_LIST.reduce((acc, o) => {
    acc[o] = exercises.filter(ex => ex.otot === o).length;
    return acc;
  }, {});

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

      {/* CONFIRM DELETE MODAL */}
      {confirm && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 998,
          display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)",
        }}>
          <div style={{
            background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20, padding: 32, width: 360, textAlign: "center",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ color: "white", fontSize: 18, marginBottom: 8 }}>Hapus Exercise?</h3>
            <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
              "{confirm.name}" akan dihapus permanen dari library.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setConfirm(null)} style={{
                padding: "10px 24px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent", color: "#666", cursor: "pointer",
              }}>Batal</button>
              <button onClick={() => handleDelete(confirm.id)} style={{
                padding: "10px 24px", borderRadius: 12, border: "none",
                background: "#e03030", color: "white", cursor: "pointer", fontWeight: 600,
              }}>Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {modal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 997,
          display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)",
        }}>
          <div style={{
            background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 24, padding: 36, width: 440,
          }}>
            <h3 style={{
              fontSize: 20, fontWeight: 700, marginBottom: 24,
              background: "linear-gradient(90deg,#e03030,#cc44cc)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              {editData ? "Edit Exercise" : "Tambah Exercise Baru"}
            </h3>

            {/* Nama Latihan */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ color: "#888", fontSize: 12, fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 8 }}>
                NAMA LATIHAN *
              </label>
              <input
                value={form.nama_latihan}
                onChange={e => setForm({ ...form, nama_latihan: e.target.value })}
                placeholder="cth: Bench Press, Squat..."
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 12,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "white", fontSize: 14, outline: "none", boxSizing: "border-box",
                }}
              />
            </div>

            {/* Otot */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ color: "#888", fontSize: 12, fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 8 }}>
                OTOT TARGET *
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {OTOT_LIST.map(o => {
                  const c = ototColor(o);
                  const isSelected = form.otot === o;
                  return (
                    <button key={o} onClick={() => setForm({ ...form, otot: o })} style={{
                      padding: "7px 14px", borderRadius: 20, border: `1px solid ${isSelected ? c : "rgba(255,255,255,0.08)"}`,
                      background: isSelected ? `${c}20` : "transparent",
                      color: isSelected ? c : "#666", cursor: "pointer", fontSize: 13, fontWeight: 600,
                      transition: "all 0.2s",
                    }}>{o}</button>
                  );
                })}
              </div>
            </div>

            {/* Video */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ color: "#888", fontSize: 12, fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 8 }}>
                LINK VIDEO (opsional)
              </label>
              <input
                value={form.video_latihan}
                onChange={e => setForm({ ...form, video_latihan: e.target.value })}
                placeholder="https://youtube.com/..."
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 12,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "white", fontSize: 14, outline: "none", boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setModal(false)} style={{
                flex: 1, padding: "12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent", color: "#666", cursor: "pointer", fontSize: 14,
              }}>Batal</button>
              <button onClick={handleSave} disabled={saving} style={{
                flex: 2, padding: "12px", borderRadius: 12, border: "none",
                background: "linear-gradient(135deg,#e03030,#cc44cc)",
                color: "white", cursor: saving ? "not-allowed" : "pointer",
                fontSize: 14, fontWeight: 700, opacity: saving ? 0.7 : 1,
              }}>
                {saving ? "Menyimpan..." : editData ? "Update Exercise" : "Tambah Exercise"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h1 style={{
            fontSize: 34, fontWeight: 800, margin: 0,
            background: "linear-gradient(90deg, #e03030, #cc44cc)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Workout Management</h1>
          <p style={{ color: "#555", fontSize: 14, marginTop: 6 }}>
            Kelola library exercise FIT-IN — {exercises.length} exercise tersedia
          </p>
        </div>
        <button onClick={openAdd} style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "12px 22px", borderRadius: 14, border: "none",
          background: "linear-gradient(135deg,#e03030,#cc44cc)",
          color: "white", cursor: "pointer", fontSize: 14, fontWeight: 700,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Tambah Exercise
        </button>
      </div>
      <div style={{ height: 1, background: "linear-gradient(90deg, #e03030, transparent)", marginBottom: 28, opacity: 0.3 }} />

      {/* OTOT SUMMARY CARDS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        <button onClick={() => setFilterOtot("all")} style={{
          padding: "8px 18px", borderRadius: 30, cursor: "pointer", fontSize: 13, fontWeight: 600,
          border: `1px solid ${filterOtot === "all" ? "#e03030" : "rgba(255,255,255,0.08)"}`,
          background: filterOtot === "all" ? "rgba(224,48,48,0.15)" : "transparent",
          color: filterOtot === "all" ? "#e03030" : "#555",
        }}>Semua ({exercises.length})</button>
        {OTOT_LIST.map(o => {
          const c = ototColor(o);
          const isActive = filterOtot === o;
          return (
            <button key={o} onClick={() => setFilterOtot(o)} style={{
              padding: "8px 16px", borderRadius: 30, cursor: "pointer", fontSize: 13, fontWeight: 600,
              border: `1px solid ${isActive ? c : "rgba(255,255,255,0.06)"}`,
              background: isActive ? `${c}15` : "transparent",
              color: isActive ? c : "#555",
            }}>{o} ({grouped[o] || 0})</button>
          );
        })}
      </div>

      {/* SEARCH */}
      <div style={{ position: "relative", marginBottom: 24, maxWidth: 380 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"
          style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Cari nama exercise..."
          style={{
            width: "100%", padding: "11px 14px 11px 40px", borderRadius: 12,
            background: "rgba(15,15,25,0.8)", border: "1px solid rgba(255,255,255,0.08)",
            color: "white", fontSize: 14, outline: "none", boxSizing: "border-box",
          }}
        />
      </div>

      {/* EXERCISE GRID */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#555" }}>
          <div style={{ width: 36, height: 36, border: "3px solid #e03030", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          Loading exercises...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: "center", padding: 60,
          background: "rgba(15,15,25,0.6)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 20,
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>💪</div>
          <p style={{ color: "#555" }}>Belum ada exercise. Tambahkan sekarang!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {filtered.map(ex => {
            const c = ototColor(ex.otot);
            return (
              <div key={ex.id} style={{
                background: "rgba(15,15,25,0.8)", border: `1px solid ${c}20`,
                borderRadius: 18, padding: "22px 20px",
                backdropFilter: "blur(10px)", transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 30px ${c}15`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div>
                    <h3 style={{ color: "white", fontSize: 15, fontWeight: 700, margin: "0 0 8px" }}>
                      {ex.nama_latihan}
                    </h3>
                    <span style={{
                      padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                      background: `${c}20`, color: c, border: `1px solid ${c}30`,
                    }}>{ex.otot}</span>
                  </div>
                  <span style={{ color: "#444", fontSize: 12 }}>#{ex.id}</span>
                </div>

                {ex.video_latihan && (
                  <a href={ex.video_latihan} target="_blank" rel="noopener noreferrer" style={{
                    display: "flex", alignItems: "center", gap: 6,
                    color: "#1a6ebd", fontSize: 12, textDecoration: "none", marginBottom: 14,
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
                    </svg>
                    Lihat Video
                  </a>
                )}

                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  <button onClick={() => openEdit(ex)} style={{
                    flex: 1, padding: "8px", borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
                    color: "#aaa", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit
                  </button>
                  <button onClick={() => setConfirm({ id: ex.id, name: ex.nama_latihan })} style={{
                    padding: "8px 12px", borderRadius: 10,
                    border: "1px solid rgba(224,48,48,0.2)", background: "rgba(224,48,48,0.08)",
                    color: "#e03030", cursor: "pointer",
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        input::placeholder { color: #555; }
      `}</style>
    </div>
  );
}