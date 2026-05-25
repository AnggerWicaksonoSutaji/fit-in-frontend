/**
 * VideoContent.jsx
 * ─────────────────────────────────────────────────
 * Halaman "Workout Video" yang menampilkan daftar kategori latihan.
 *
 * Fitur:
 *   - Menampilkan grid kartu kategori video
 *   - Konten terkunci tampil dengan overlay "PREMIUM" bagi pengguna gratis
 *   - Saat kartu diklik → tampilkan halaman detail kategori (CategoryDetailPage)
 *   - Banner upgrade premium di bawah grid (untuk pengguna gratis)
 *
 * State:
 *   - selectedCategory : Kategori yang sedang dibuka detailnya (null = tampilkan grid)
 *
 * Tidak ada props yang dibutuhkan.
 * ─────────────────────────────────────────────────
 */

import { useState } from "react";
import VideoCard from "../components/VideoCard";
import CategoryDetailPage from "../components/CategoryDetailPage";
import { workoutCategories } from "../data/workoutCategories";

const VideoContent = () => {
  // Cek status premium dari localStorage
  const isPremium = localStorage.getItem("fitinPremium") === "true";

  // State untuk menyimpan kategori yang dipilih (null = tampilan grid)
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Jika ada kategori yang dipilih, tampilkan halaman detail
  if (selectedCategory) {
    return (
      <CategoryDetailPage
        category={selectedCategory}
        onBack={() => {
          setSelectedCategory(null); // Kembali ke grid
          window.scrollTo(0, 0);    // Scroll ke atas saat kembali
        }}
      />
    );
  }

  // Tampilan default: grid daftar kategori
  return (
    <div>
      {/* ── Header Halaman ── */}
      <h2 className="text-white text-2xl font-black mb-2">Workout Video</h2>
      <p className="text-gray-500 text-sm mb-6">
        Pilih kategori latihan untuk melihat video gerakan
      </p>

      {/* ── Grid Kartu Kategori ── */}
      {/* 2 kolom di layar kecil, 3 kolom di layar medium ke atas */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {workoutCategories.map((v) => (
          <VideoCard
            key={v.id}
            // Override locked: premium user bisa akses semua
            video={{ ...v, locked: isPremium ? false : v.locked }}
            onClick={setSelectedCategory} // Set kategori yang dipilih saat diklik
          />
        ))}
      </div>

      {/* ── Banner Upgrade Premium (hanya untuk pengguna gratis) ── */}
      {!isPremium && (
        <div
          className="mt-6 p-5 rounded-2xl text-center"
          style={{
            background: "linear-gradient(135deg, rgba(224,48,48,0.1), rgba(26,110,189,0.1))",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="text-4xl mb-2">🔒</div>
          <h3 className="text-white font-bold mb-1">Unlock Semua Video</h3>
          <p className="text-gray-500 text-sm mb-4">
            Upgrade ke Premium untuk akses semua video workout
          </p>
          <button
            className="px-8 py-3 rounded-xl font-bold text-white text-sm transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg,#e03030,#a00020)" }}
          >
            ⭐ Upgrade Premium
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoContent;
