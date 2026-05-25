/**
 * ExerciseCard.jsx
 * ─────────────────────────────────────────────────
 * Komponen card untuk menampilkan detail satu gerakan latihan.
 * Digunakan di dalam CategoryDetailPage.
 *
 * Menampilkan:
 *   - Header: nama gerakan + badge level kesulitan
 *   - Area video: player jika videoSrc tersedia, atau placeholder jika belum
 *   - Daftar langkah-langkah gerakan (step-by-step)
 *
 * Props:
 *   - exercise (object) : Objek data gerakan
 *     - name     (string) : Nama gerakan
 *     - level    (string) : Level kesulitan (Novice / Intermediate / Advanced)
 *     - videoSrc (string) : URL video MP4 (boleh kosong)
 *     - steps    (array)  : Array string langkah-langkah
 * ─────────────────────────────────────────────────
 */

const ExerciseCard = ({ exercise }) => {
  // Konfigurasi warna berdasarkan level kesulitan
  const levelColors = {
    Novice:       { bg: "rgba(34,197,94,0.15)",  color: "#4ade80" }, // Hijau — mudah
    Intermediate: { bg: "rgba(251,191,36,0.15)", color: "#fbbf24" }, // Kuning — sedang
    Advanced:     { bg: "rgba(239,68,68,0.15)",  color: "#f87171" }, // Merah — sulit
  };

  // Ambil warna sesuai level, fallback ke Novice jika tidak ditemukan
  const lc = levelColors[exercise.level] || levelColors.Novice;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* ── Header: Nama + Badge Level ── */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h3 className="text-white font-bold text-lg">{exercise.name}</h3>

        {/* Badge level kesulitan */}
        <span
          className="px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: lc.bg, color: lc.color }}
        >
          {exercise.level}
        </span>
      </div>

      {/* ── Area Video ── */}
      <div
        className="relative w-full"
        style={{
          aspectRatio: "16/9",
          background: "linear-gradient(135deg, #0a0a1a, #1a1a2e, #0a0a1a)",
        }}
      >
        {exercise.videoSrc ? (
          /* Tampilkan video player jika URL video tersedia */
          <video
            className="w-full h-full"
            controls
            controlsList="nodownload" // Sembunyikan tombol download
            style={{ background: "#000" }}
          >
            <source src={exercise.videoSrc} type="video/mp4" />
          </video>
        ) : (
          /* Tampilkan placeholder jika video belum tersedia */
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Icon play transparan sebagai ilustrasi */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
              style={{
                background: "rgba(224,48,48,0.15)",
                border: "2px solid rgba(224,48,48,0.25)",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e03030" strokeWidth="1.5">
                <polygon points="5,3 19,12 5,21" fill="rgba(224,48,48,0.3)" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">Video belum tersedia</p>
            <p className="text-gray-600 text-xs mt-1">Akan ditambahkan oleh admin</p>
          </div>
        )}
      </div>

      {/* ── Langkah-langkah Gerakan ── */}
      <div className="p-5">
        <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-3">
          Langkah-langkah
        </p>
        <div className="flex flex-col gap-3">
          {exercise.steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              {/* Nomor langkah dengan gradasi */}
              <div
                className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black text-white"
                style={{ background: "linear-gradient(135deg, #e03030, #1a6ebd)" }}
              >
                {i + 1}
              </div>
              {/* Teks langkah */}
              <p className="text-gray-300 text-sm leading-relaxed pt-1">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;
