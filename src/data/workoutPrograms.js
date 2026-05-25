/**
 * workoutPrograms.js
 * ─────────────────────────────────────────────────
 * File ini menyimpan data statis untuk 3 program workout
 * utama yang tersedia di aplikasi FIT-IN.
 *
 * Setiap program memiliki:
 *   - title  : Nama program
 *   - color  : Warna tema (digunakan untuk aksen UI)
 *   - desc   : Deskripsi singkat program
 *   - tags   : Array tag/label kategori program
 *   - locked : Apakah program ini membutuhkan akses premium
 * ─────────────────────────────────────────────────
 */

export const workoutPrograms = [
  {
    title: "Bulking",
    color: "#e03030", // Merah — melambangkan intensitas & kekuatan
    desc: "Bulking adalah fase dalam program fitness yang bertujuan untuk meningkatkan massa otot dan berat badan melalui kombinasi latihan beban intensif dan peningkatan asupan kalori (surplus kalori).",
    tags: ["Strength", "High Calories", "Muscle Gain"],
    locked: false, // Tersedia untuk semua pengguna
  },
  {
    title: "Cutting",
    color: "#1a6ebd", // Biru — melambangkan kardio & pernafasan
    desc: "Cutting adalah fase yang bertujuan untuk menurunkan lemak tubuh sambil mempertahankan massa otot dengan cara mengurangi asupan kalori (defisit kalori) dan meningkatkan aktivitas fisik.",
    tags: ["Cardio", "Low Calories", "Fat Loss"],
    locked: false, // Tersedia untuk semua pengguna
  },
  {
    title: "Maintenance",
    color: "#8b1a8b", // Ungu — melambangkan keseimbangan
    desc: "Maintenance adalah fase untuk menjaga komposisi tubuh yang sudah ideal, yaitu dengan menyeimbangkan asupan kalori dan aktivitas fisik agar berat badan dan massa otot tetap stabil.",
    tags: ["Balance", "Normal Calories", "Stable"],
    locked: false, // Tersedia untuk semua pengguna
  },
];
