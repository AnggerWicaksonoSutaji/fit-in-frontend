/**
 * Sidebar.jsx
 * ─────────────────────────────────────────────────
 * Komponen sidebar navigasi utama aplikasi FIT-IN.
 *
 * Fitur:
 *   - Collapsible (bisa dilipat menjadi icon saja)
 *   - Highlight menu yang sedang aktif
 *   - Banner upgrade premium (hanya saat sidebar terbuka)
 *   - Tombol logout di bagian bawah
 *
 * Props:
 *   - active       (string)   : Key menu yang sedang aktif
 *   - setActive    (function) : Setter untuk mengganti menu aktif
 *   - collapsed    (boolean)  : Status sidebar dilipat atau tidak
 *   - setCollapsed (function) : Setter untuk toggle collapse
 *   - onLogout     (function) : Callback saat tombol logout diklik
 *   - onNavigate   (function) : Callback navigasi ke halaman lain (misal: payment)
 * ─────────────────────────────────────────────────
 */

import Logo from "./Logo";
import { navItems } from "../data/navItems";
import { icons } from "../data/icons";

const Sidebar = ({ active, setActive, collapsed, setCollapsed, onLogout, onNavigate, isPremium }) => (
  <aside
    className="flex flex-col h-screen sticky top-0 transition-all duration-300 z-30"
    style={{
      width: collapsed ? 70 : 240, // Lebar berubah saat dilipat
      background: "linear-gradient(180deg, #0f0f0f 0%, #1a0a0a 50%, #0a0a1a 100%)",
      borderRight: "1px solid rgba(255,255,255,0.07)",
    }}
  >
    {/* ── Header: Logo + Tombol Toggle ── */}
    <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
      <Logo size={36} />

      {/* Teks "FIT-IN" hanya tampil saat sidebar tidak dilipat */}
      {!collapsed && (
        <span
          className="font-black text-lg tracking-widest"
          style={{
            background: "linear-gradient(90deg,#e03030,#cc44cc,#1a6ebd)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          FIT-IN
        </span>
      )}

      {/* Tombol toggle collapse/expand sidebar */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="ml-auto text-gray-500 hover:text-white transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {collapsed ? (
            /* Icon 3 garis (menu) saat sidebar dilipat */
            <>
              <path d="M3 12h18" />
              <path d="M3 6h18" />
              <path d="M3 18h18" />
            </>
          ) : (
            /* Icon X (tutup) saat sidebar terbuka */
            <>
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </>
          )}
        </svg>
      </button>
    </div>

    {/* ── Daftar Menu Navigasi ── */}
    <nav className="flex-1 py-4 overflow-y-auto">
      {navItems.map((item) => {
        const isActive = active === item.key; // Cek apakah menu ini sedang aktif
        return (
          <button
            key={item.key}
            onClick={() => setActive(item.key)} // Ganti halaman aktif saat diklik
            className="w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 relative group"
            style={{
              color: isActive ? "#fff" : "#666",
              // Background highlight merah transparan untuk menu aktif
              background: isActive
                ? "linear-gradient(90deg, rgba(224,48,48,0.15), transparent)"
                : "transparent",
            }}
          >
            {/* Garis indikator vertikal di sisi kiri untuk menu aktif */}
            {isActive && (
              <span
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                style={{ background: "linear-gradient(180deg,#e03030,#cc44cc)" }}
              />
            )}

            {/* Icon menu */}
            <span className={`transition-colors ${isActive ? "text-red-400" : "text-gray-600 group-hover:text-gray-300"}`}>
              <svg
                width="20" height="20" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
              >
                {/* Render path SVG: bisa berupa array (multi-path) atau string tunggal */}
                {Array.isArray(item.icon)
                  ? item.icon.map((p, i) => <path key={i} d={p} />)
                  : <path d={item.icon} />}
              </svg>
            </span>

            {/* Label menu — hanya tampil saat sidebar tidak dilipat */}
            {!collapsed && (
              <span className={`text-sm font-medium tracking-wide transition-colors ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-200"}`}>
                {item.label}
              </span>
            )}
          </button>
        );
      })}
    </nav>

    {/* ── Banner Upgrade Premium ── */}
    {/* Hanya tampil saat sidebar tidak dilipat dan bukan akun premium */}
    {!collapsed && !isPremium && (
      <div
        className="mx-3 mb-3 p-3 rounded-xl"
        style={{
          background: "linear-gradient(135deg, rgba(224,48,48,0.2), rgba(26,110,189,0.2))",
          border: "1px solid rgba(224,48,48,0.3)",
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          {/* Icon bintang kuning */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1">
            <path d={icons.star} />
          </svg>
          <span className="text-yellow-400 text-xs font-bold">UPGRADE PRO</span>
        </div>
        <p className="text-gray-400 text-xs mb-2">Unlock semua fitur premium!</p>
        {/* Tombol navigasi ke halaman pembayaran */}
        <button
          className="w-full py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:brightness-110"
          style={{ background: "linear-gradient(135deg,#e03030,#a00020)" }}
          onClick={() => onNavigate("payment")}
        >
          Upgrade Sekarang
        </button>
      </div>
    )}

    {/* ── Tombol Logout ── */}
    <button
      onClick={onLogout}
      className="flex items-center gap-3 px-4 py-4 border-t border-white/5 text-gray-600 hover:text-red-400 transition-colors"
    >
      {/* Icon logout */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M16 17l5-5-5-5" />
        <path d="M21 12H9" />
      </svg>
      {/* Label logout — hanya tampil saat sidebar tidak dilipat */}
      {!collapsed && <span className="text-sm font-medium">Logout</span>}
    </button>
  </aside>
);

export default Sidebar;
