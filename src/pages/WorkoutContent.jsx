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

import { useState } from "react";
import ProgramCard from "../components/ProgramCard";
import { workoutPrograms } from "../data/workoutPrograms";

const WorkoutContent = ({ onNavigate, setActive }) => {
  const isPremium = localStorage.getItem("fitinPremium") === "true";
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, programTitle: "" });
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: "" });

  const handleStartProgram = (programTitle) => {
    if (isPremium) {
      const rawProfile = localStorage.getItem("fitinProfile");
      const profile = rawProfile ? JSON.parse(rawProfile) : { goal: "maintenance" };
      
      // Jika program yang dipilih sama dengan program yang sedang aktif
      if (profile.goal.toLowerCase() === programTitle.toLowerCase()) {
        setAlertModal({ isOpen: true, message: "Program ini sudah aktif dan sedang Anda jalani." });
        return;
      }

      // Jika berbeda, tampilkan pop-up konfirmasi
      setConfirmModal({ isOpen: true, programTitle });
    } else {
      // Jika Non-Premium, arahkan ke halaman pembayaran
      if (onNavigate) onNavigate("payment");
    }
  };

  const confirmChangeProgram = () => {
    const rawProfile = localStorage.getItem("fitinProfile");
    const profile = rawProfile ? JSON.parse(rawProfile) : { goal: "maintenance" };
    profile.goal = confirmModal.programTitle.toLowerCase();
    localStorage.setItem("fitinProfile", JSON.stringify(profile));
    
    // Kalkulasi ulang kalori dan makronutrisi agar tidak perlu ke Data Diri
    if (profile.weight && profile.height && profile.age) {
      const w = parseFloat(profile.weight);
      const h = parseFloat(profile.height);
      const a = parseFloat(profile.age);
      let bmr = profile.gender === "male"
        ? 10 * w + 6.25 * h - 5 * a + 5
        : 10 * w + 6.25 * h - 5 * a - 161;
      const actMultiplier = { jarang: 1.2, sedang: 1.55, sering: 1.725 };
      const tdee = Math.round(bmr * (actMultiplier[profile.activityLevel] || 1.55));
      
      let targetCal = tdee;
      if (profile.goal === "cutting") targetCal = Math.round(tdee * 0.8);
      if (profile.goal === "bulking") targetCal = Math.round(tdee * 1.15);
      
      const protein = Math.round((targetCal * 0.3) / 4);
      const carbs = Math.round((targetCal * 0.45) / 4);
      const fat = Math.round((targetCal * 0.25) / 9);
      
      localStorage.setItem("fitinNutrition", JSON.stringify({ tdee, targetCal, protein, carbs, fat }));
    }
    
    setConfirmModal({ isOpen: false, programTitle: "" });
    if (setActive) setActive("home");
  };

  return (
    <div className="relative">
      {/* ── Header Halaman ── */}
      <h2 className="text-white text-2xl font-black mb-2">Workout Program</h2>
      <p className="text-gray-500 text-sm mb-6">
        Pilih program yang sesuai dengan tujuan fitness kamu
      </p>

      {/* ── Grid Kartu Program ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {workoutPrograms.map((p) => (
          <ProgramCard 
            key={p.title} 
            program={p} 
            onStart={() => handleStartProgram(p.title)}
          />
        ))}
      </div>

      {/* ── Pop-Up Peringatan (Sudah Terpilih) ── */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div 
            className="rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl"
            style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div className="text-4xl mb-4">ℹ️</div>
            <h3 className="text-xl font-bold text-white mb-2">Program Aktif</h3>
            <p className="text-gray-400 text-sm mb-6">
              {alertModal.message}
            </p>
            <button 
              onClick={() => setAlertModal({ isOpen: false, message: "" })}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110"
              style={{ background: "linear-gradient(135deg, #1a6ebd, #0a3a7a)" }}
            >
              Oke, Mengerti
            </button>
          </div>
        </div>
      )}

      {/* ── Pop-Up Konfirmasi ── */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div 
            className="rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl"
            style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-white mb-2">Ganti Program?</h3>
            <p className="text-gray-400 text-sm mb-6">
              Apakah Anda yakin akan mengganti workout program Anda menjadi <strong className="text-white">{confirmModal.programTitle}</strong>?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmModal({ isOpen: false, programTitle: "" })}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={confirmChangeProgram}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110"
                style={{ background: "linear-gradient(135deg, #e03030, #1a6ebd)" }}
              >
                Ya, Ganti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutContent;
