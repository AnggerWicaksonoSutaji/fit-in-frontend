import { useState } from "react";
import axios from "axios";
import Logo from "../components/Logo";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

const Field = ({ label, placeholder, type = "text", value, onChange, maxLength }) => (
  <div className="mb-4">
    <label className="text-gray-300 text-xs font-semibold mb-1.5 block tracking-wide">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none transition-colors"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
    />
  </div>
);

export default function DataDiriPage({ onSuccess, onBack }) {
  const [profile, setProfile] = useState({
    age: "", gender: "male", weight: "", height: "",
    activityLevel: "sedang", goal: "maintenance",
  });
  const [profileError, setProfileError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleProfileSubmit = async () => {
    if (!profile.age || !profile.weight || !profile.height) {
      setProfileError("Umur, berat badan, dan tinggi badan wajib diisi.");
      return;
    }
    setProfileError("");
    setLoading(true);

    // Simpan data diri ke localStorage
    localStorage.setItem("fitinProfile", JSON.stringify(profile));
    
    // Hitung TDEE lokal
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
    
    // Inisialisasi stats jika belum ada
    if (!localStorage.getItem("fitinStats")) {
      localStorage.setItem("fitinStats", JSON.stringify({ workouts: 0, calories: 0, streak: 0, goalPct: 0 }));
    }

    // Kirim ke backend
    try {
      const token = localStorage.getItem("fitinToken");
      await api.post("/profile", {
        umur: parseInt(profile.age),
        jenis_kelamin: profile.gender === "male" ? "Laki-laki" : "Perempuan",
        berat_badan: parseFloat(profile.weight),
        tinggi_badan: parseFloat(profile.height),
        tingkat_aktivitas: profile.activityLevel,
        goal: profile.goal,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch { 
      /* fallback: tetap lanjut walaupun gagal simpan ke backend */ 
    } finally {
      setLoading(false);
      onSuccess();
    }
  };

  return (
    <div className="min-h-screen relative" style={{ background: "linear-gradient(135deg,#0a0a0a,#1a0a0a,#0a0a1a)", fontFamily: "'Trebuchet MS',sans-serif" }}>
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-20 flex items-center justify-center w-10 h-10
            rounded border border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400 transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </button>
      )}
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <Logo size={50} />
          <h2 className="text-white text-xl font-black mt-3 mb-1">Lengkapi Data Diri</h2>
          <p className="text-gray-500 text-sm">Data ini digunakan untuk menghitung kebutuhan nutrisi dan menyusun program latihanmu</p>
        </div>

        <div className="rounded-2xl p-5 mb-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <Field label="Umur" placeholder="contoh: 22" type="number" value={profile.age}
            onChange={e => setProfile({...profile, age: e.target.value})} />

          <div className="mb-4">
            <label className="text-gray-300 text-xs font-semibold mb-1.5 block tracking-wide">Jenis Kelamin</label>
            <div className="flex gap-3">
              {[{v:"male",l:"Laki-laki",emoji:"👨"},{v:"female",l:"Perempuan",emoji:"👩"}].map(g => (
                <button key={g.v} onClick={() => setProfile({...profile, gender: g.v})}
                  className="flex-1 py-3 rounded-xl font-bold text-sm transition-all"
                  style={{
                    background: profile.gender === g.v ? "rgba(224,48,48,0.15)" : "rgba(255,255,255,0.05)",
                    border: `2px solid ${profile.gender === g.v ? "#e03030" : "rgba(255,255,255,0.1)"}`,
                    color: profile.gender === g.v ? "#fff" : "#666",
                  }}>
                  {g.emoji} {g.l}
                </button>
              ))}
            </div>
          </div>

          <Field label="Berat Badan (kg)" placeholder="contoh: 65" type="number" value={profile.weight}
            onChange={e => setProfile({...profile, weight: e.target.value})} />
          <Field label="Tinggi Badan (cm)" placeholder="contoh: 170" type="number" value={profile.height}
            onChange={e => setProfile({...profile, height: e.target.value})} />

          <div className="mb-4">
            <label className="text-gray-300 text-xs font-semibold mb-1.5 block tracking-wide">Tingkat Aktivitas</label>
            <div className="flex flex-col gap-2">
              {[{v:"jarang",l:"Jarang Olahraga",d:"Aktivitas fisik ringan / sedentary"},{v:"sedang",l:"Cukup Aktif",d:"Olahraga 3-5x seminggu"},{v:"sering",l:"Sangat Aktif",d:"Olahraga 6-7x seminggu / pekerjaan fisik"}].map(a => (
                <button key={a.v} onClick={() => setProfile({...profile, activityLevel: a.v})}
                  className="w-full text-left rounded-xl p-3 transition-all"
                  style={{
                    background: profile.activityLevel === a.v ? "rgba(224,48,48,0.15)" : "rgba(255,255,255,0.05)",
                    border: `2px solid ${profile.activityLevel === a.v ? "#e03030" : "rgba(255,255,255,0.1)"}`,
                  }}>
                  <p className="font-bold text-sm" style={{ color: profile.activityLevel === a.v ? "#fff" : "#888" }}>{a.l}</p>
                  <p className="text-xs" style={{ color: "#666" }}>{a.d}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-2">
            <label className="text-gray-300 text-xs font-semibold mb-1.5 block tracking-wide">Tujuan Fitness</label>
            <div className="flex gap-2">
              {[{v:"cutting",l:"Cutting",c:"#1a6ebd",e:"🔥"},{v:"maintenance",l:"Maintain",c:"#8b1a8b",e:"⚖️"},{v:"bulking",l:"Bulking",c:"#e03030",e:"💪"}].map(g => (
                <button key={g.v} onClick={() => setProfile({...profile, goal: g.v})}
                  className="flex-1 py-3 rounded-xl font-bold text-sm transition-all text-center"
                  style={{
                    background: profile.goal === g.v ? `${g.c}25` : "rgba(255,255,255,0.05)",
                    border: `2px solid ${profile.goal === g.v ? g.c : "rgba(255,255,255,0.1)"}`,
                    color: profile.goal === g.v ? "#fff" : "#666",
                  }}>
                  {g.e}<br/>{g.l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {profileError && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl px-4 py-2 mb-4">
            <p className="text-red-400 text-xs">{profileError}</p>
          </div>
        )}

        <button onClick={handleProfileSubmit} disabled={loading}
          className="w-full py-4 rounded-2xl font-black text-white text-sm tracking-wide transition-all hover:brightness-110 hover:scale-[1.02] disabled:opacity-70"
          style={{ background: "linear-gradient(135deg,#e03030,#a00020)", boxShadow: "0 8px 24px rgba(224,48,48,0.3)" }}>
          {loading ? "Menyimpan..." : "Simpan dan Mulai 🚀"}
        </button>
      </div>
    </div>
  );
}
