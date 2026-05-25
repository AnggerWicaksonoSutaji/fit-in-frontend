/**
 * NutritionContent.jsx
 * ─────────────────────────────────────────────────
 * Halaman "Nutrition" yang menampilkan kebutuhan nutrisi harian
 * pengguna berdasarkan data profil yang sudah diisi.
 *
 * Logika tampilan:
 *   - Jika pengguna PREMIUM & data nutrisi + profil tersedia:
 *     → Tampilkan rincian kalori, protein, karbohidrat, lemak
 *   - Selain itu:
 *     → Tampilkan placeholder dengan tombol upgrade premium
 *
 * Data diambil dari localStorage:
 *   - "fitinPremium"   : Status premium (boolean string)
 *   - "fitinNutrition" : Hasil kalkulasi nutrisi (JSON)
 *   - "fitinProfile"   : Data profil pengguna (JSON)
 *
 * Props:
 *   - onNavigate (function) : Fungsi navigasi ke halaman pembayaran
 * ─────────────────────────────────────────────────
 */

import PremiumUpgradeButton from "../components/PremiumUpgradeButton";

const NutritionContent = ({ onNavigate }) => {
  // Ambil status premium
  const isPremium = localStorage.getItem("fitinPremium") === "true";

  // Ambil data nutrisi hasil kalkulasi (disimpan saat pengisian profil)
  const rawNutrition = localStorage.getItem("fitinNutrition");
  const nutrition = rawNutrition ? JSON.parse(rawNutrition) : null;

  // Ambil data profil pengguna (disimpan saat pengisian profil)
  const rawProfile = localStorage.getItem("fitinProfile");
  const profile = rawProfile ? JSON.parse(rawProfile) : null;

  // Label tampilan untuk goal program
  const goalLabel = {
    cutting:     "Cutting (Defisit)",
    bulking:     "Bulking (Surplus)",
    maintenance: "Maintenance",
  };

  // ── Tampilan Pengguna Premium dengan Data Lengkap ──
  if (isPremium && nutrition && profile) {
    return (
      <div>
        <h2 className="text-white text-2xl font-black mb-2">Nutrition & Meal Plan</h2>
        <p className="text-gray-500 text-sm mb-6">
          Kebutuhan nutrisi harian berdasarkan data diri kamu
        </p>

        {/* Kartu Target Kalori Utama */}
        <div
          className="rounded-2xl p-6 mb-5 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(224,48,48,0.15), rgba(26,110,189,0.15))",
            border: "1px solid rgba(224,48,48,0.3)",
          }}
        >
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">
            Target Kalori Harian
          </p>
          {/* Angka kalori besar dengan gradasi warna */}
          <div
            className="text-5xl font-black mb-1"
            style={{
              background: "linear-gradient(90deg,#e03030,#1a6ebd)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {nutrition.targetCal}
          </div>
          <p className="text-gray-500 text-sm">kkal / hari</p>
          {/* TDEE dan goal pengguna */}
          <p className="text-gray-600 text-xs mt-2">
            TDEE: {nutrition.tdee} kkal | Goal: {goalLabel[profile.goal] || profile.goal}
          </p>
        </div>

        {/* Grid Makronutrien: Protein, Karbohidrat, Lemak */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {[
            { title: "Protein",      value: nutrition.protein + "g", color: "#e03030", emoji: "🥩" },
            { title: "Karbohidrat",  value: nutrition.carbs + "g",   color: "#1a6ebd", emoji: "🍚" },
            { title: "Lemak",        value: nutrition.fat + "g",      color: "#8b1a8b", emoji: "🥑" },
          ].map((m) => (
            <div
              key={m.title}
              className="rounded-2xl p-5 text-center"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${m.color}25`,
              }}
            >
              <div className="text-3xl mb-2">{m.emoji}</div>
              <div className="text-2xl font-black" style={{ color: m.color }}>
                {m.value}
              </div>
              <p className="text-white font-bold text-sm mt-1">{m.title}</p>
            </div>
          ))}
        </div>

        {/* Ringkasan Data Diri yang Digunakan untuk Kalkulasi */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h3 className="text-white font-bold text-sm mb-3">Data Diri Kamu</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            {[
              { l: "Umur",      v: profile.age + " thn" },
              { l: "Gender",    v: profile.gender === "male" ? "Laki-laki" : "Perempuan" },
              { l: "Berat",     v: profile.weight + " kg" },
              { l: "Tinggi",    v: profile.height + " cm" },
              { l: "Aktivitas", v: profile.activityLevel },
              { l: "Goal",      v: profile.goal },
            ].map((d) => (
              <div
                key={d.l}
                className="rounded-lg p-2"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <span className="text-gray-500">{d.l}: </span>
                <span className="text-white font-semibold">{d.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Tampilan Jika Premium Tapi Belum Isi Profil ──
  if (isPremium && (!nutrition || !profile)) {
    return (
      <div>
        <h2 className="text-white text-2xl font-black mb-2">Nutrition & Meal Plan</h2>
        <p className="text-gray-500 text-sm mb-6">
          Kebutuhan nutrisi harian berdasarkan data diri kamu
        </p>
        <div
          className="mt-5 p-5 rounded-2xl text-center"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="text-3xl mb-2">📋</div>
          <p className="text-white text-lg font-bold mb-1">Lengkapi Data Diri</p>
          <p className="text-gray-400 text-sm mb-4">
            Silakan lengkapi data diri Anda terlebih dahulu agar kami dapat menghitung kebutuhan nutrisi yang tepat.
          </p>
          <button
            onClick={() => onNavigate("data-diri")}
            className="px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg,#e03030,#a00020)" }}
          >
            Lengkapi Data Diri Sekarang →
          </button>
        </div>
      </div>
    );
  }

  // ── Tampilan Default: Placeholder untuk Pengguna Non-Premium ──
  return (
    <div>
      <h2 className="text-white text-2xl font-black mb-2">Nutrition</h2>
      <p className="text-gray-500 text-sm mb-6">
        Panduan nutrisi untuk mendukung program fitness kamu
      </p>
      <div
        className="mt-5 p-5 rounded-2xl text-center"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="text-3xl mb-2">🔒</div>
        <p className="text-gray-400 text-sm mb-3">
          Meal plan harian dan kalkulasi kalori tersedia di Premium
        </p>
        {/* Tombol upgrade reusable */}
        <PremiumUpgradeButton onNavigate={onNavigate} />
      </div>
    </div>
  );
};

export default NutritionContent;
