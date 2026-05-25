/**
 * workoutCategories.js
 * ─────────────────────────────────────────────────
 * File ini menyimpan data statis untuk 6 kategori workout
 * beserta daftar gerakan (exercises) di setiap kategori.
 *
 * Struktur data:
 *   - id        : ID unik kategori
 *   - title     : Nama kategori
 *   - level     : Tingkat kesulitan (Beginner / Intermediate / Advanced)
 *   - locked    : Apakah kategori ini membutuhkan akses premium
 *   - thumb     : Emoji ikon kategori
 *   - desc      : Deskripsi singkat kategori
 *   - exercises : Array gerakan dalam kategori ini
 *
 * Setiap exercise memiliki:
 *   - id       : ID unik gerakan
 *   - name     : Nama gerakan
 *   - level    : Tingkat kesulitan gerakan
 *   - videoSrc : URL video (kosong jika belum tersedia)
 *   - steps    : Array langkah-langkah melakukan gerakan
 * ─────────────────────────────────────────────────
 */

export const workoutCategories = [
  {
    id: 1,
    title: "Full Body Workout",
    level: "Beginner",
    locked: false, // Gratis — bisa diakses tanpa premium
    thumb: "🏃",
    desc: "Latihan full body untuk pemula yang mencakup gerakan dasar untuk melatih seluruh tubuh.",
    exercises: [
      {
        id: "ex1",
        name: "Push Up",
        level: "Novice",
        videoSrc: "", // Video belum tersedia, akan diisi oleh admin
        steps: [
          "Posisi plank dengan tangan selebar bahu.",
          "Turunkan badan hingga dada hampir menyentuh lantai.",
          "Dorong kembali ke posisi awal.",
        ],
      },
      {
        id: "ex2",
        name: "Squat",
        level: "Novice",
        videoSrc: "",
        steps: [
          "Berdiri dengan kaki selebar bahu.",
          "Turunkan badan seperti duduk di kursi.",
          "Kembali ke posisi berdiri.",
        ],
      },
      {
        id: "ex3",
        name: "Plank",
        level: "Novice",
        videoSrc: "",
        steps: [
          "Posisi tengkurap, topang tubuh dengan siku dan jari kaki.",
          "Jaga tubuh lurus dari kepala hingga kaki.",
          "Tahan posisi selama 30-60 detik.",
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Upper Body Strength",
    level: "Intermediate",
    locked: true, // Premium only
    thumb: "💪",
    desc: "Latihan kekuatan tubuh bagian atas dengan fokus pada dada, bahu, dan lengan.",
    exercises: [
      {
        id: "ex4",
        name: "Bench Press",
        level: "Intermediate",
        videoSrc: "",
        steps: [
          "Berbaring di bench, pegang barbell selebar bahu.",
          "Turunkan barbell ke dada secara perlahan.",
          "Dorong barbell ke atas hingga lengan lurus.",
        ],
      },
      {
        id: "ex5",
        name: "Machine Pec Fly",
        level: "Novice",
        videoSrc: "",
        steps: [
          "Duduk di mesin, pegang handle dengan lengan terbuka.",
          "Rapatkan kedua lengan di depan dada.",
          "Kembalikan ke posisi awal secara perlahan.",
        ],
      },
      {
        id: "ex6",
        name: "Shoulder Press",
        level: "Intermediate",
        videoSrc: "",
        steps: [
          "Pegang dumbbell setinggi bahu.",
          "Angkat ke atas hingga lengan lurus.",
          "Turunkan kembali ke posisi awal.",
        ],
      },
    ],
  },
  {
    id: 3,
    title: "HIIT Cardio Blast",
    level: "Advanced",
    locked: true, // Premium only
    thumb: "🔥",
    desc: "Latihan kardio intensitas tinggi untuk membakar kalori maksimal dalam waktu singkat.",
    exercises: [
      {
        id: "ex7",
        name: "Burpees",
        level: "Advanced",
        videoSrc: "",
        steps: [
          "Berdiri tegak, lalu jongkok dan letakkan tangan di lantai.",
          "Lompat kaki ke belakang ke posisi plank.",
          "Lompat kaki ke depan lalu lompat ke atas.",
        ],
      },
      {
        id: "ex8",
        name: "Mountain Climbers",
        level: "Intermediate",
        videoSrc: "",
        steps: [
          "Mulai dari posisi plank.",
          "Tarik lutut kanan ke dada secara bergantian.",
          "Lakukan dengan cepat seperti berlari.",
        ],
      },
      {
        id: "ex9",
        name: "Jump Squats",
        level: "Intermediate",
        videoSrc: "",
        steps: [
          "Lakukan squat biasa.",
          "Dari posisi bawah, lompat setinggi mungkin.",
          "Mendarat dengan lembut dan ulangi.",
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Core & Abs Routine",
    level: "Intermediate",
    locked: true, // Premium only
    thumb: "⚡",
    desc: "Latihan khusus untuk memperkuat otot inti dan perut agar lebih stabil dan kencang.",
    exercises: [
      {
        id: "ex10",
        name: "Crunch",
        level: "Novice",
        videoSrc: "",
        steps: [
          "Berbaring telentang dengan lutut ditekuk.",
          "Angkat bahu dari lantai menggunakan otot perut.",
          "Turunkan kembali secara perlahan.",
        ],
      },
      {
        id: "ex11",
        name: "Russian Twist",
        level: "Intermediate",
        videoSrc: "",
        steps: [
          "Duduk dengan lutut ditekuk, condongkan badan ke belakang.",
          "Putar tubuh ke kiri sambil memegang beban.",
          "Putar ke kanan dan ulangi.",
        ],
      },
      {
        id: "ex12",
        name: "Leg Raise",
        level: "Intermediate",
        videoSrc: "",
        steps: [
          "Berbaring telentang dengan kaki lurus.",
          "Angkat kedua kaki hingga 90 derajat.",
          "Turunkan perlahan tanpa menyentuh lantai.",
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Leg Day Crusher",
    level: "Advanced",
    locked: true, // Premium only
    thumb: "🦵",
    desc: "Latihan berat untuk kaki mencakup squat, lunges, dan variasi gerakan kaki lainnya.",
    exercises: [
      {
        id: "ex13",
        name: "Barbell Squat",
        level: "Advanced",
        videoSrc: "",
        steps: [
          "Letakkan barbell di pundak belakang.",
          "Turunkan badan ke posisi squat dalam.",
          "Dorong ke atas hingga berdiri tegak.",
        ],
      },
      {
        id: "ex14",
        name: "Leg Press",
        level: "Intermediate",
        videoSrc: "",
        steps: [
          "Duduk di mesin leg press.",
          "Dorong platform dengan kaki hingga hampir lurus.",
          "Turunkan kembali secara perlahan.",
        ],
      },
      {
        id: "ex15",
        name: "Walking Lunges",
        level: "Intermediate",
        videoSrc: "",
        steps: [
          "Berdiri tegak, langkahkan satu kaki ke depan.",
          "Turunkan lutut belakang hingga hampir menyentuh lantai.",
          "Langkahkan kaki berikutnya dan ulangi.",
        ],
      },
    ],
  },
  {
    id: 6,
    title: "Yoga & Stretching",
    level: "Beginner",
    locked: true, // Premium only
    thumb: "🧘",
    desc: "Sesi yoga dan peregangan untuk meningkatkan fleksibilitas dan relaksasi tubuh.",
    exercises: [
      {
        id: "ex16",
        name: "Downward Dog",
        level: "Novice",
        videoSrc: "",
        steps: [
          "Mulai dari posisi merangkak.",
          "Angkat pinggul ke atas membentuk huruf V terbalik.",
          "Tahan posisi selama 30 detik.",
        ],
      },
      {
        id: "ex17",
        name: "Warrior Pose",
        level: "Novice",
        videoSrc: "",
        steps: [
          "Berdiri lebar, putar kaki kanan ke samping.",
          "Tekuk lutut kanan 90 derajat.",
          "Rentangkan tangan sejajar dengan lantai.",
        ],
      },
      {
        id: "ex18",
        name: "Child's Pose",
        level: "Novice",
        videoSrc: "",
        steps: [
          "Berlutut dengan jari kaki menyentuh.",
          "Duduk di tumit dan rentangkan tangan ke depan.",
          "Tahan dan rilekskan seluruh tubuh.",
        ],
      },
    ],
  },
];
