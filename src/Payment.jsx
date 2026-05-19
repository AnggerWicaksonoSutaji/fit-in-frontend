import { useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

/* ── Logo ── */
const Logo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
    <path d="M15 85 Q35 50 100 45 L85 110 Q50 105 15 85Z" fill="url(#rGp)" opacity="0.9" />
    <path d="M185 85 Q165 50 100 45 L115 110 Q150 105 185 85Z" fill="url(#bGp)" opacity="0.9" />
    <path d="M85 110 Q100 170 100 170 Q100 170 115 110 L100 45Z" fill="url(#cGp)" />
    <ellipse cx="100" cy="82" rx="18" ry="14" fill="url(#eGp)" />
    <ellipse cx="100" cy="82" rx="9" ry="7" fill="#1a0a0a" />
    <defs>
      <linearGradient id="rGp" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ff2020" /><stop offset="100%" stopColor="#c0001a" />
      </linearGradient>
      <linearGradient id="bGp" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1a6ebd" /><stop offset="100%" stopColor="#0a3a7a" />
      </linearGradient>
      <linearGradient id="cGp" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e03030" /><stop offset="50%" stopColor="#8b1a8b" /><stop offset="100%" stopColor="#1a6ebd" />
      </linearGradient>
      <radialGradient id="eGp" cx="50%" cy="40%">
        <stop offset="0%" stopColor="#ff5555" /><stop offset="100%" stopColor="#cc0000" />
      </radialGradient>
    </defs>
  </svg>
);

/* ── Plans ── */
const plans = [
  {
    id: "monthly",
    label: "1 Bulan",
    price: "Rp 49.000",
    priceNum: 49000,
    period: "/ bulan",
    badge: null,
    color: "#1a6ebd",
  },
  {
    id: "quarterly",
    label: "3 Bulan",
    price: "Rp 129.000",
    priceNum: 129000,
    period: "/ 3 bulan",
    badge: "HEMAT 12%",
    color: "#e03030",
  },
  {
    id: "yearly",
    label: "12 Bulan",
    price: "Rp 449.000",
    priceNum: 449000,
    period: "/ tahun",
    badge: "HEMAT 24%",
    color: "#8b1a8b",
  },
];



/* ── Input Field ── */
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

/* ════════════════════════════════════════
   PAYMENT PAGE
════════════════════════════════════════ */
export default function Payment({ onBack, onSuccess }) {
  const [selectedPlan,   setSelectedPlan]   = useState("quarterly");
  const [step,           setStep]           = useState(1); // 1=pilih, 2=sukses, 3=data diri
  const [loading,        setLoading]        = useState(false);

  // Form data diri untuk kalkulasi nutrisi
  const [profile, setProfile] = useState({
    age: "", gender: "male", weight: "", height: "",
    activityLevel: "sedang", goal: "maintenance",
  });
  const [profileError, setProfileError] = useState("");

  const plan   = plans.find(p => p.id === selectedPlan);

  const handlePay = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("fitinToken");

      // 1) Pastikan packages sudah di-seed, dan cari paket_id yang benar
      const { data: packages } = await api.get("/packages", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Map frontend plan -> backend nama_paket
      const planMap = { monthly: "Bulanan", quarterly: "3 Bulan", yearly: "Tahunan" };
      const matchedPaket = packages.find(p => p.nama_paket === planMap[selectedPlan]);
      const paketId = matchedPaket ? matchedPaket.id : packages[0]?.id || 1;

      // 2) Checkout ke backend dengan paket_id yang benar
      const { data: checkoutData } = await api.post("/payment/checkout", { paket_id: paketId }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 3) Backend berhasil — dapatkan snap_token (jika sudah ada di backend)
      // contoh integrasi midtrans (nantinya akan dipanggil di sini):
      // window.snap.pay(checkoutData.snap_token, {
      //   onSuccess: function(result){ ... },
      //   onPending: function(result){ ... },
      //   onError: function(result){ ... }
      // });
      
      window.snap.pay(checkoutData.snap_token, {
        onSuccess: function(result) {
          // Logika ketika pembayaran sukses
          localStorage.setItem("fitinPremium", "true");
          localStorage.setItem("fitinPlan", selectedPlan);
          
          if (checkoutData.user) {
            localStorage.setItem("fitinUser", JSON.stringify(checkoutData.user));
          }
          
          setStep(2); // Lanjut ke halaman sukses
        },
        onPending: function(result) {
          // Logika ketika menunggu pembayaran
          console.log("Payment pending:", result);
        },
        onError: function(result) {
          // Logika jika pembayaran gagal
          console.error("Payment error:", result);
          alert("Pembayaran gagal!");
        },
        onClose: function() {
          console.log("Customer closed the popup without finishing the payment");
        }
      });

    } catch (e) {
      console.error("Checkout error:", e);
      alert("Gagal memproses pembayaran: " + (e.response?.data?.error || e.message || "Pastikan script Midtrans ter-load"));
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async () => {
    if (!profile.age || !profile.weight || !profile.height) {
      setProfileError("Umur, berat badan, dan tinggi badan wajib diisi.");
      return;
    }
    setProfileError("");
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
    // Inisialisasi stats
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
    } catch (e) { /* fallback: tetap lanjut */ }
    onSuccess();
  };

  // ── STEP 2: SUCCESS ──
  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6"
        style={{ background: "linear-gradient(135deg,#0a0a0a,#1a0a0a,#0a0a1a)", fontFamily: "'Trebuchet MS',sans-serif" }}>
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto mb-6"
            style={{ background: "linear-gradient(135deg,rgba(34,197,94,0.2),rgba(34,197,94,0.1))", border: "2px solid rgba(34,197,94,0.4)" }}>
            ✓
          </div>
          <h2 className="text-white text-2xl font-black mb-2">Pembayaran Berhasil!</h2>
          <p className="text-gray-400 text-sm mb-2">
            Selamat! Kamu sudah menjadi member <span className="text-yellow-400 font-bold">FIT-IN Premium</span>
          </p>
          <p className="text-gray-500 text-xs mb-8">
            Paket: <span className="text-white">{plan?.label}</span> — {plan?.price}
          </p>
          <div className="rounded-2xl p-4 mb-6"
            style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
            <p className="text-green-400 text-sm font-semibold mb-1">✓ Akses Premium Aktif</p>
            <p className="text-gray-500 text-xs">Lengkapi data diri untuk mengaktifkan semua fitur</p>
          </div>
          <button
            onClick={() => setStep(3)}
            className="w-full py-4 rounded-2xl font-black text-white text-sm tracking-wide transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg,#e03030,#a00020)" }}>
            Lengkapi Data Diri →
          </button>
        </div>
      </div>
    );
  }

  // ── STEP 3: DATA DIRI ──
  if (step === 3) {
    return (
      <div className="min-h-screen" style={{ background: "linear-gradient(135deg,#0a0a0a,#1a0a0a,#0a0a1a)", fontFamily: "'Trebuchet MS',sans-serif" }}>
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

          <button onClick={handleProfileSubmit}
            className="w-full py-4 rounded-2xl font-black text-white text-sm tracking-wide transition-all hover:brightness-110 hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg,#e03030,#a00020)", boxShadow: "0 8px 24px rgba(224,48,48,0.3)" }}>
            Masuk ke Dashboard Premium 🚀
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg,#0a0a0a,#1a0a0a,#0a0a1a)", fontFamily: "'Trebuchet MS',sans-serif" }}>

      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center gap-4 px-6 py-4"
        style={{ background: "rgba(10,10,10,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <button onClick={onBack}
          className="flex items-center justify-center w-9 h-9 rounded-xl text-gray-400 hover:text-white transition-all"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <Logo size={30} />
        <div>
          <h1 className="text-white font-black text-base">FIT-IN Premium</h1>
          <p className="text-gray-500 text-xs">Upgrade Akun</p>
        </div>
        {/* Step Indicator */}
        <div className="ml-auto flex items-center gap-2">
          {[1,2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  background: step >= s ? "linear-gradient(135deg,#e03030,#a00020)" : "rgba(255,255,255,0.05)",
                  color: step >= s ? "#fff" : "#555",
                  border: step >= s ? "none" : "1px solid rgba(255,255,255,0.1)",
                }}>
                {step > s ? "✓" : s}
              </div>
              {s < 2 && <div className="w-6 h-0.5" style={{ background: step > s ? "#e03030" : "rgba(255,255,255,0.1)" }} />}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* ── STEP 1: PILIH PAKET ── */}
        {step === 1 && (
          <div>
            <h2 className="text-white text-xl font-black mb-1">Pilih Paket</h2>
            <p className="text-gray-500 text-sm mb-5">Pilih durasi langganan yang sesuai</p>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 gap-3 mb-6">
              {plans.map(p => (
                <button key={p.id} onClick={() => setSelectedPlan(p.id)}
                  className="w-full text-left rounded-2xl p-4 transition-all relative overflow-hidden"
                  style={{
                    background: selectedPlan === p.id ? `${p.color}18` : "rgba(255,255,255,0.03)",
                    border: `2px solid ${selectedPlan === p.id ? p.color : "rgba(255,255,255,0.08)"}`,
                  }}>
                  {p.badge && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-black"
                      style={{ background: p.color, color: "#fff" }}>
                      {p.badge}
                    </span>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{ borderColor: selectedPlan === p.id ? p.color : "#444" }}>
                      {selectedPlan === p.id && (
                        <div className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-bold">{p.label}</p>
                      <p className="text-gray-500 text-xs">Akses penuh semua fitur premium</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black" style={{ color: p.color }}>{p.price}</p>
                      <p className="text-gray-500 text-xs">{p.period}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* What's included */}
            <div className="rounded-2xl p-5 mb-6"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="text-white font-bold text-sm mb-3">Yang Kamu Dapat:</h3>
              {[
                "✅ Semua Workout Program (Bulking, Cutting, Maintenance)",
                "✅ Akses Semua Video Workout Premium",
                "✅ Workout Planner Otomatis",
                "✅ Pantau Progress Real-Time",
                "✅ Kontrol Nutrisi & Kalori",
                "✅ Jadwal Latihan Personal",
                "✅ Akses prioritas fitur baru",
              ].map((f, i) => (
                <p key={i} className="text-gray-400 text-xs mb-1.5">{f}</p>
              ))}
            </div>

            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full py-4 rounded-2xl font-black text-white text-sm tracking-wide transition-all hover:brightness-110 hover:scale-[1.02] disabled:opacity-70"
              style={{ background: "linear-gradient(135deg,#e03030,#a00020)", boxShadow: "0 8px 24px rgba(224,48,48,0.3)" }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Memproses...
                </span>
              ) : "Bayar"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
