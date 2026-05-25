/**
 * ProgramCard.jsx
 * ─────────────────────────────────────────────────
 * Komponen card untuk menampilkan satu program workout
 * (Bulking, Cutting, atau Maintenance).
 *
 * Menampilkan:
 *   - Indikator warna program
 *   - Judul program
 *   - Deskripsi program
 *   - Tag-tag kategori (contoh: "Strength", "Cardio", dll)
 *   - Tombol "Mulai Program"
 *
 * Props:
 *   - program (object) : Objek data program dari workoutPrograms.js
 *     - title  (string)  : Nama program
 *     - color  (string)  : Warna hex tema program
 *     - desc   (string)  : Deskripsi program
 *     - tags   (array)   : Array string tag program
 *     - locked (boolean) : Status kunci program
 * ─────────────────────────────────────────────────
 */

const ProgramCard = ({ program }) => (
  <div
    className="rounded-2xl p-5 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-2xl"
    style={{
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${program.color}30`,       // Border tipis dengan warna program
      boxShadow: `0 4px 24px ${program.color}10`,   // Shadow halus dengan warna program
    }}
  >
    {/* Header: Indikator warna + Judul */}
    <div className="flex items-center gap-3 mb-3">
      {/* Titik warna penanda program */}
      <div
        className="w-3 h-3 rounded-full"
        style={{
          background: program.color,
          boxShadow: `0 0 8px ${program.color}`, // Efek glowing pada titik
        }}
      />
      <h3 className="font-bold text-lg" style={{ color: program.color }}>
        {program.title}
      </h3>
    </div>

    {/* Deskripsi program */}
    <p className="text-gray-400 text-sm leading-relaxed mb-4">{program.desc}</p>

    {/* Tag-tag kategori */}
    <div className="flex flex-wrap gap-2">
      {program.tags.map((tag) => (
        <span
          key={tag}
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{
            background: `${program.color}15`, // Background transparan dengan warna program
            color: program.color,
            border: `1px solid ${program.color}30`,
          }}
        >
          {tag}
        </span>
      ))}
    </div>

    {/* Tombol aksi */}
    <button
      className="mt-4 w-full py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all hover:brightness-110 hover:scale-[1.02]"
      style={{
        background: `linear-gradient(135deg, ${program.color}, ${program.color}88)`,
        color: "#fff",
      }}
    >
      Mulai Program
    </button>
  </div>
);

export default ProgramCard;
