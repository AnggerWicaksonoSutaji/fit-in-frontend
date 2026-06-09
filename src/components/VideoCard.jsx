/**
 * VideoCard.jsx
 * ─────────────────────────────────────────────────
 * Komponen card untuk menampilkan satu kategori video workout.
 * Digunakan di halaman VideoContent dan HomeContent (preview).
 *
 * Menampilkan:
 *   - Area thumbnail dengan SVG icon berdasarkan judul kategori
 *   - Overlay gembok jika konten terkunci (premium)
 *   - Overlay tombol play jika konten bebas
 *   - Info: judul, durasi, dan level kesulitan
 *
 * Props:
 *   - video (object) : Objek data kategori dari workoutCategories.js
 *     - title    (string)  : Judul kategori
 *     - locked   (boolean) : Status premium
 *     - duration (string)  : Durasi estimasi (opsional)
 *     - level    (string)  : Tingkat kesulitan
 *   - onClick (function) : Callback saat card diklik (hanya jika tidak terkunci)
 * ─────────────────────────────────────────────────
 */

/**
 * CategoryIcon — Mengembalikan SVG icon sesuai judul kategori.
 * Menggantikan emoji agar tampilan lebih konsisten dan profesional.
 */
const CategoryIcon = ({ title, size = 48, color = "#ffffff" }) => {
  const t = (title || "").toLowerCase();

  // Full Body Workout — ikon orang berlari
  if (t.includes("full body") || t.includes("full")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="4" r="2" />
        <path d="M15.09 8.26A2 2 0 0 0 13.26 7h-2.52A2 2 0 0 0 8.91 8.26L7 14h2l1 6h4l1-6h2z" />
        <path d="M7 14l-2 3" />
        <path d="M17 14l2 3" />
      </svg>
    );
  }

  // Upper Body Strength — ikon dumbbell / angkat beban
  if (t.includes("upper")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4v16" />
        <path d="M18 4v16" />
        <path d="M4 7h4" />
        <path d="M16 7h4" />
        <path d="M4 17h4" />
        <path d="M16 17h4" />
        <path d="M8 12h8" />
      </svg>
    );
  }

  // HIIT Cardio — ikon detak jantung / zigzag
  if (t.includes("hiit") || t.includes("cardio")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    );
  }

  // Core & Abs — ikon target / inti
  if (t.includes("core") || t.includes("abs")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    );
  }

  // Leg Day — ikon arah panah ke bawah / kaki
  if (t.includes("leg") || t.includes("lower")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2v10l-3 9" />
        <path d="M14 2v10l3 9" />
        <path d="M10 8h4" />
      </svg>
    );
  }

  // Yoga & Stretching — ikon orang meditasi
  if (t.includes("yoga") || t.includes("stretch") || t.includes("recovery")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="4" r="2" />
        <path d="M12 6v5" />
        <path d="M7 9c1.5 0 3.5 1 5 1s3.5-1 5-1" />
        <path d="M9 20l3-9 3 9" />
      </svg>
    );
  }

  // Default fallback — ikon bintang/bintang olahraga
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
};

const VideoCard = ({ video, onClick }) => (
  <div
    className="rounded-2xl overflow-hidden transition-all duration-300 hover:translate-y-[-2px] cursor-pointer"
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
    }}
    // Hanya trigger onClick jika video tidak terkunci
    onClick={() => !video.locked && onClick && onClick(video)}
  >
    {/* ── Area Thumbnail ── */}
    <div
      className="relative h-36 flex items-center justify-center text-5xl"
      style={
        video.image
          ? {
              backgroundImage: `url(${video.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : { background: "linear-gradient(135deg, #1a1a2e, #16213e)" }
      }
    >
      {/* Overlay gelap di atas foto agar icon & teks tetap terbaca */}
      {video.image && (
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.40)" }}
        />
      )}



      {/* Overlay PREMIUM jika video terkunci */}
      {video.locked && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center z-20"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
        >
          {/* Icon gembok */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
            <path d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="text-yellow-400 text-xs font-bold mt-1">PREMIUM</span>
        </div>
      )}

      {/* Overlay tombol PLAY jika video tidak terkunci */}
      {!video.locked && (
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-20"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          {/* Tombol play bulat */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: "rgba(224,48,48,0.9)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
        </div>
      )}
    </div>

    {/* ── Area Informasi Card ── */}
    <div className="p-4">
      {/* Judul video/kategori */}
      <h4 className="text-white text-sm font-semibold mb-2">{video.title}</h4>

      {/* Durasi dan level kesulitan */}
      <div className="flex items-center gap-3 text-xs text-gray-500">
        {/* Ikon jam — durasi */}
        {video.duration && (
          <span className="flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {video.duration}
          </span>
        )}

        {/* Badge level kesulitan dengan warna berbeda per level */}
        <span
          className="px-2 py-0.5 rounded-full"
          style={{
            background:
              video.level === "Beginner"
                ? "rgba(34,197,94,0.15)"
                : video.level === "Intermediate"
                  ? "rgba(251,191,36,0.15)"
                  : "rgba(239,68,68,0.15)",
            color:
              video.level === "Beginner"
                ? "#4ade80"
                : video.level === "Intermediate"
                  ? "#fbbf24"
                  : "#f87171",
          }}
        >
          {video.level}
        </span>
      </div>
    </div>
  </div>
);

export default VideoCard;
