/**
 * CategoryDetailPage.jsx
 * ─────────────────────────────────────────────────
 * Komponen halaman detail yang ditampilkan saat pengguna
 * memilih satu kategori workout video.
 *
 * Menampilkan:
 *   - Tombol "Kembali" ke daftar video
 *   - Header kategori: judul, deskripsi, level, jumlah gerakan
 *   - Daftar gerakan menggunakan komponen ExerciseCard
 *
 * Props:
 *   - category (object)   : Objek data kategori dari workoutCategories.js
 *   - onBack (function)   : Callback untuk kembali ke daftar kategori
 * ─────────────────────────────────────────────────
 */

import ExerciseCard from "./ExerciseCard";

const CategoryDetailPage = ({ category, onBack }) => (
  <div>
    {/* ── Tombol Kembali ── */}
    <button
      onClick={onBack}
      className="flex items-center gap-2 mb-5 px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-all"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Icon panah kiri */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="15,18 9,12 15,6" />
      </svg>
      Kembali ke Daftar Video
    </button>

    {/* ── Header Kategori ── */}
    <div
      className="rounded-2xl p-6 mb-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(224,48,48,0.15), rgba(26,110,189,0.15))",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Emoji dekoratif di pojok kanan */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-8xl opacity-20">
        {category.thumb}
      </div>

      {/* Judul dan deskripsi kategori */}
      <h2 className="text-white text-2xl font-black mb-2">{category.title}</h2>
      <p className="text-gray-400 text-sm leading-relaxed mb-3 max-w-xl">{category.desc}</p>

      {/* Badge level + jumlah gerakan */}
      <div className="flex items-center gap-3">
        <span
          className="px-3 py-1 rounded-full text-xs font-bold"
          style={{
            background:
              category.level === "Beginner"
                ? "rgba(34,197,94,0.15)"
                : category.level === "Intermediate"
                ? "rgba(251,191,36,0.15)"
                : "rgba(239,68,68,0.15)",
            color:
              category.level === "Beginner"
                ? "#4ade80"
                : category.level === "Intermediate"
                ? "#fbbf24"
                : "#f87171",
          }}
        >
          {category.level}
        </span>
        <span className="text-gray-500 text-xs">{category.exercises.length} gerakan</span>
      </div>
    </div>

    {/* ── Daftar Gerakan ── */}
    <h3 className="text-white font-bold text-lg mb-4">💪 Daftar Gerakan</h3>
    <div className="flex flex-col gap-5">
      {/* Render ExerciseCard untuk setiap gerakan di kategori ini */}
      {category.exercises.map((ex) => (
        <ExerciseCard key={ex.id} exercise={ex} />
      ))}
    </div>
  </div>
);

export default CategoryDetailPage;
