/**
 * icons.js
 * ─────────────────────────────────────────────────
 * File ini menyimpan semua definisi path SVG yang digunakan
 * di seluruh aplikasi FIT-IN.
 *
 * Cara penggunaan:
 *   import { icons } from '../data/icons';
 *
 * Setiap key adalah nama icon, dan value-nya adalah
 * string path SVG (atau array string untuk icon multi-path).
 * ─────────────────────────────────────────────────
 */

export const icons = {
  // Icon rumah — digunakan di menu Home
  home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",

  // Icon workout (barbel) — multi-path, digunakan di menu Workout Program
  workout: ["M6.5 6.5h11", "M6.5 17.5h11", "M12 2v20", "M2 12h4", "M18 12h4"],

  // Icon play video — digunakan di menu Workout Video
  video:
    "M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z",

  // Icon gelas/kopi — digunakan di menu Nutrition
  nutrition: [
    "M18 8h1a4 4 0 0 1 0 8h-1",
    "M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z",
    "M6 1v3",
    "M10 1v3",
    "M14 1v3",
  ],

  // Icon lingkaran jam — digunakan di menu BMI Calculator
  bmi: [
    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z",
    "M12 6v6l4 2",
  ],

  // Icon grafik — digunakan di menu Progress
  progress: ["M3 3v18h18", "M18 9l-5 5-4-4-3 3"],

  // Icon kalender — digunakan di menu Schedule
  schedule: [
    "M8 2v4",
    "M16 2v4",
    "M3 10h18",
    "M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z",
  ],

  // Icon orang — digunakan di menu Profile
  profile: [
    "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2",
    "M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  ],

  // Icon logout/keluar — digunakan di tombol logout sidebar
  logout: [
    "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
    "M16 17l5-5-5-5",
    "M21 12H9",
  ],

  // Icon hamburger menu (3 garis) — digunakan di tombol toggle sidebar
  menu: ["M3 12h18", "M3 6h18", "M3 18h18"],

  // Icon X (tutup) — digunakan di tombol tutup popup
  close: ["M18 6L6 18", "M6 6l12 12"],

  // Icon bintang — digunakan di badge premium
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",

  // Icon gembok — digunakan untuk konten yang terkunci (premium only)
  lock: [
    "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z",
    "M7 11V7a5 5 0 0 1 10 0v4",
  ],

  // Icon api — digunakan sebagai ikon dekoratif
  fire:
    "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",

  // Icon centang — digunakan untuk menandai item selesai
  check: "M20 6L9 17l-5-5",
};
