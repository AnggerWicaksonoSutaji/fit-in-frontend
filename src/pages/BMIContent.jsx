/**
 * BMIContent.jsx
 * ─────────────────────────────────────────────────
 * Halaman "BMI Calculator" untuk menghitung Body Mass Index.
 *
 * Rumus BMI: berat (kg) / (tinggi (m))²
 *
 * Kategori BMI:
 *   - < 18.5  : Underweight (Biru)
 *   - 18.5–24.9: Normal     (Hijau)
 *   - 25–29.9 : Overweight  (Kuning)
 *   - ≥ 30    : Obesitas    (Merah)
 *
 * State:
 *   - height (string) : Input tinggi badan dalam cm
 *   - weight (string) : Input berat badan dalam kg
 *   - bmi    (number) : Hasil kalkulasi BMI (null sebelum dihitung)
 *
 * Tidak ada props yang dibutuhkan.
 * ─────────────────────────────────────────────────
 */

import { useState } from "react";

const BMIContent = () => {
  const [height, setHeight] = useState(""); // Tinggi badan (cm)
  const [weight, setWeight] = useState(""); // Berat badan (kg)
  const [bmi, setBmi] = useState(null);    // Hasil BMI (null = belum dihitung)

  /**
   * calcBMI
   * Menghitung nilai BMI dari input tinggi dan berat badan.
   * Tinggi dikonversi dari cm ke meter terlebih dahulu.
   */
  const calcBMI = () => {
    const h = parseFloat(height) / 100; // Konversi cm → meter
    const w = parseFloat(weight);
    // Pastikan nilai valid sebelum menghitung
    if (h > 0 && w > 0) setBmi((w / (h * h)).toFixed(1));
  };

  /**
   * getCategory
   * Mengembalikan label dan warna kategori berdasarkan nilai BMI.
   * @param {number} b - Nilai BMI
   * @returns {{ label: string, color: string }}
   */
  const getCategory = (b) => {
    if (b < 18.5) return { label: "Underweight", color: "#3b82f6" }; // Biru
    if (b < 25)   return { label: "Normal",      color: "#22c55e" }; // Hijau
    if (b < 30)   return { label: "Overweight",  color: "#f59e0b" }; // Kuning
    return             { label: "Obesitas",    color: "#ef4444" }; // Merah
  };

  // Ambil kategori berdasarkan hasil BMI (null jika belum dihitung)
  const cat = bmi ? getCategory(parseFloat(bmi)) : null;

  return (
    <div>
      {/* ── Header Halaman ── */}
      <h2 className="text-white text-2xl font-black mb-2">BMI Calculator</h2>
      <p className="text-gray-500 text-sm mb-6">
        Hitung Body Mass Index kamu untuk mengetahui kondisi berat badan
      </p>

      {/* ── Form Kalkulator ── */}
      <div className="max-w-md mx-auto">
        <div
          className="rounded-2xl p-6"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Input Tinggi Badan */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm block mb-2">Tinggi Badan (cm)</label>
            <input
              type="number"
              placeholder="contoh: 170"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {/* Input Berat Badan */}
          <div className="mb-6">
            <label className="text-gray-400 text-sm block mb-2">Berat Badan (kg)</label>
            <input
              type="number"
              placeholder="contoh: 65"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {/* Tombol Hitung */}
          <button
            onClick={calcBMI}
            className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg,#e03030,#a00020)" }}
          >
            Hitung BMI
          </button>

          {/* ── Hasil Kalkulasi (tampil setelah tombol diklik) ── */}
          {bmi && cat && (
            <div className="mt-6 text-center">
              {/* Angka BMI besar */}
              <div className="text-6xl font-black mb-2" style={{ color: cat.color }}>
                {bmi}
              </div>

              {/* Badge kategori */}
              <div
                className="inline-block px-4 py-1 rounded-full text-sm font-bold mb-3"
                style={{ background: `${cat.color}20`, color: cat.color }}
              >
                {cat.label}
              </div>

              {/* Tabel referensi semua kategori BMI */}
              <div className="grid grid-cols-4 gap-1 mt-4">
                {[
                  { r: "< 18.5",    l: "Underweight", c: "#3b82f6" },
                  { r: "18.5-24.9", l: "Normal",      c: "#22c55e" },
                  { r: "25-29.9",   l: "Overweight",  c: "#f59e0b" },
                  { r: "≥ 30",      l: "Obesitas",    c: "#ef4444" },
                ].map((item) => (
                  <div
                    key={item.l}
                    className="rounded-lg p-2 text-center"
                    style={{
                      background: `${item.c}10`,
                      border: `1px solid ${item.c}30`,
                    }}
                  >
                    <div className="text-xs font-bold" style={{ color: item.c }}>{item.r}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BMIContent;
