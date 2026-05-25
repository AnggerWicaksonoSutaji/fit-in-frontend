/**
 * WorkoutContent.jsx
 * ─────────────────────────────────────────────────
 * Halaman "Workout Program" yang menampilkan semua
 * program latihan yang tersedia (Bulking, Cutting, Maintenance).
 *
 * Menggunakan:
 *   - Komponen ProgramCard untuk setiap program
 *   - Data dari workoutPrograms.js
 *
 * Tidak ada props yang dibutuhkan.
 * ─────────────────────────────────────────────────
 */

import ProgramCard from "../components/ProgramCard";
import { workoutPrograms } from "../data/workoutPrograms";

const WorkoutContent = () => (
  <div>
    {/* ── Header Halaman ── */}
    <h2 className="text-white text-2xl font-black mb-2">Workout Program</h2>
    <p className="text-gray-500 text-sm mb-6">
      Pilih program yang sesuai dengan tujuan fitness kamu
    </p>

    {/* ── Grid Kartu Program ── */}
    {/* Tampil 1 kolom di layar kecil, 3 kolom di layar medium ke atas */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {workoutPrograms.map((p) => (
        <ProgramCard key={p.title} program={p} />
      ))}
    </div>
  </div>
);

export default WorkoutContent;
