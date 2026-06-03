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

import { useState, useEffect } from "react";
import VideoCard from "../components/VideoCard";
import CategoryDetailPage from "../components/CategoryDetailPage";
import { workoutCategories } from "../data/workoutCategories";

const VideoContent = ({ initialCategory, onClearCategory, triggerStreak }) => {
  // Cek status premium dari localStorage
  const isPremium = localStorage.getItem("fitinPremium") === "true";

  // State untuk menyimpan kategori yang dipilih (null = tampilan grid)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Sinkronisasi selectedCategory saat initialCategory berubah dari parent
  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  // Trigger streak saat memilih kategori (bagian otot) untuk user non-premium
  useEffect(() => {
    if (selectedCategory && !isPremium && triggerStreak) {
      triggerStreak();
    }
  }, [selectedCategory, isPremium, triggerStreak]);

  // Jika ada kategori yang dipilih, tampilkan halaman detail
  if (selectedCategory) {
    return (
      <CategoryDetailPage
        category={selectedCategory}
        onBack={() => {
          setSelectedCategory(null); // Kembali ke grid
          if (onClearCategory) onClearCategory(); // Hapus state di parent
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
            video={v}
            onClick={setSelectedCategory} // Set kategori yang dipilih saat diklik
          />
        ))}
      </div>
    </div>
  );
};

export default VideoContent;
