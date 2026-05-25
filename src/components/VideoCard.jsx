/**
 * VideoCard.jsx
 * ─────────────────────────────────────────────────
 * Komponen card untuk menampilkan satu kategori video workout.
 * Digunakan di halaman VideoContent dan HomeContent (preview).
 *
 * Menampilkan:
 *   - Area thumbnail dengan emoji
 *   - Overlay gembok jika konten terkunci (premium)
 *   - Overlay tombol play jika konten bebas
 *   - Info: judul, durasi, dan level kesulitan
 *
 * Props:
 *   - video (object) : Objek data kategori dari workoutCategories.js
 *     - title    (string)  : Judul kategori
 *     - thumb    (string)  : Emoji thumbnail
 *     - locked   (boolean) : Status premium
 *     - duration (string)  : Durasi estimasi (opsional)
 *     - level    (string)  : Tingkat kesulitan
 *   - onClick (function) : Callback saat card diklik (hanya jika tidak terkunci)
 * ─────────────────────────────────────────────────
 */

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
      style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}
    >
      {/* Emoji thumbnail */}
      <span>{video.thumb}</span>

      {/* Overlay PREMIUM jika video terkunci */}
      {video.locked && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
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
          className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
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
        {/* Tampilkan durasi jika ada */}
        {video.duration && <span>⏱ {video.duration}</span>}

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
