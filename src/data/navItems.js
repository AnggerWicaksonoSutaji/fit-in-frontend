/**
 * navItems.js
 * ─────────────────────────────────────────────────
 * File ini mendefinisikan daftar item navigasi yang
 * ditampilkan di sidebar aplikasi FIT-IN.
 *
 * Setiap item memiliki:
 *   - key    : ID unik untuk menentukan halaman aktif
 *   - label  : Teks yang ditampilkan di sidebar
 *   - icon   : Path SVG icon (string atau array string)
 * ─────────────────────────────────────────────────
 */

import { icons } from "./icons";

export const navItems = [
  {
    key: "home",        // Halaman utama / dashboard ringkasan
    label: "Home",
    icon: icons.home,
  },
  {
    key: "workout",     // Halaman daftar program workout (Bulking, Cutting, dll)
    label: "Workout Program",
    icon: icons.workout,
  },
  {
    key: "video",       // Halaman daftar video latihan per kategori
    label: "Workout Video",
    icon: icons.video,
  },
  {
    key: "nutrition",   // Halaman kalkulasi nutrisi & meal plan (fitur premium)
    label: "Nutrition",
    icon: icons.nutrition,
  },
  {
    key: "bmi",         // Halaman kalkulator Body Mass Index
    label: "BMI Calculator",
    icon: icons.bmi,
  },
  {
    key: "progress",    // Halaman pantau perkembangan latihan (fitur premium)
    label: "Progress",
    icon: icons.progress,
  },
  {
    key: "schedule",    // Halaman jadwal latihan mingguan (fitur premium)
    label: "Schedule",
    icon: icons.schedule,
  },
  {
    key: "profile",     // Halaman informasi profil pengguna
    label: "Profile",
    icon: icons.profile,
  },
];
