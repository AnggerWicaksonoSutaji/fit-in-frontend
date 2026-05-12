import { useState } from "react";

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

const paymentMethods = [
  { id: "bca",     label: "BCA",          icon: "🏦", type: "bank",   number: "1234567890",   name: "FIT-IN INDONESIA" },
  { id: "bni",     label: "BNI",          icon: "🏦", type: "bank",   number: "0987654321",   name: "FIT-IN INDONESIA" },
  { id: "mandiri", label: "Mandiri",       icon: "🏦", type: "bank",   number: "1122334455",   name: "FIT-IN INDONESIA" },
  { id: "gopay",   label: "GoPay",         icon: "💚", type: "ewallet", number: "081234567890", name: "FIT-IN INDONESIA" },
  { id: "ovo",     label: "OVO",           icon: "💜", type: "ewallet", number: "081234567890", name: "FIT-IN INDONESIA" },
  { id: "dana",    label: "DANA",          icon: "💙", type: "ewallet", number: "081234567890", name: "FIT-IN INDONESIA" },
  { id: "qris",    label: "QRIS",          icon: "📱", type: "qris",    number: null,            name: null },
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
  const [selectedMethod, setSelectedMethod] = useState("bca");
  const [step,           setStep]           = useState(1); // 1=pilih, 2=detail, 3=konfirmasi, 4=sukses
  const [loading,        setLoading]        = useState(false);

  const [form, setForm] = useState({
    cardName: "", cardNumber: "", expiry: "", cvv: "",
    proofNote: "",
  });

  const plan   = plans.find(p => p.id === selectedPlan);
  const method = paymentMethods.find(m => m.id === selectedMethod);

  const formatCard = (val) => val.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
  const formatExpiry = (val) => {
    const v = val.replace(/\D/g, "");
    return v.length >= 3 ? v.slice(0,2) + "/" + v.slice(2,4) : v;
  };

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(4);
      // Simpan status premium di localStorage
      localStorage.setItem("fitinPremium", "true");
      localStorage.setItem("fitinPlan", selectedPlan);
    }, 2500);
  };

  // ── STEP 4: SUCCESS ──
  if (step === 4) {
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
            <p className="text-gray-500 text-xs">Semua fitur premium sudah bisa digunakan</p>
          </div>
          <button
            onClick={onSuccess}
            className="w-full py-4 rounded-2xl font-black text-white text-sm tracking-wide transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg,#e03030,#a00020)" }}>
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
          {[1,2,3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  background: step >= s ? "linear-gradient(135deg,#e03030,#a00020)" : "rgba(255,255,255,0.05)",
                  color: step >= s ? "#fff" : "#555",
                  border: step >= s ? "none" : "1px solid rgba(255,255,255,0.1)",
                }}>
                {step > s ? "✓" : s}
              </div>
              {s < 3 && <div className="w-6 h-0.5" style={{ background: step > s ? "#e03030" : "rgba(255,255,255,0.1)" }} />}
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
                "✅ 50+ Video Workout HD",
                "✅ Workout Planner Otomatis",
                "✅ Pantau Progress Real-Time",
                "✅ Kontrol Nutrisi & Kalori",
                "✅ Jadwal Latihan Personal",
                "✅ Akses prioritas fitur baru",
              ].map((f, i) => (
                <p key={i} className="text-gray-400 text-xs mb-1.5">{f}</p>
              ))}
            </div>

            <button onClick={() => setStep(2)}
              className="w-full py-4 rounded-2xl font-black text-white text-sm tracking-wide transition-all hover:brightness-110 hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg,#e03030,#a00020)", boxShadow: "0 8px 24px rgba(224,48,48,0.3)" }}>
              Lanjut Pilih Pembayaran →
            </button>
          </div>
        )}

        {/* ── STEP 2: METODE BAYAR ── */}
        {step === 2 && (
          <div>
            <h2 className="text-white text-xl font-black mb-1">Metode Pembayaran</h2>
            <p className="text-gray-500 text-sm mb-5">Pilih cara pembayaran yang kamu inginkan</p>

            {/* Summary */}
            <div className="rounded-2xl p-4 mb-5 flex items-center justify-between"
              style={{ background: "rgba(224,48,48,0.1)", border: "1px solid rgba(224,48,48,0.25)" }}>
              <div>
                <p className="text-gray-400 text-xs">Paket dipilih</p>
                <p className="text-white font-bold">{plan?.label} Premium</p>
              </div>
              <p className="text-red-400 font-black text-lg">{plan?.price}</p>
            </div>

            {/* Bank Transfer */}
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-3">Transfer Bank</p>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {paymentMethods.filter(m => m.type === "bank").map(m => (
                <button key={m.id} onClick={() => setSelectedMethod(m.id)}
                  className="py-3 rounded-xl font-bold text-sm transition-all"
                  style={{
                    background: selectedMethod === m.id ? "rgba(224,48,48,0.15)" : "rgba(255,255,255,0.03)",
                    border: `2px solid ${selectedMethod === m.id ? "#e03030" : "rgba(255,255,255,0.08)"}`,
                    color: selectedMethod === m.id ? "#fff" : "#666",
                  }}>
                  {m.icon} {m.label}
                </button>
              ))}
            </div>

            {/* E-Wallet */}
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-3">E-Wallet</p>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {paymentMethods.filter(m => m.type === "ewallet").map(m => (
                <button key={m.id} onClick={() => setSelectedMethod(m.id)}
                  className="py-3 rounded-xl font-bold text-sm transition-all"
                  style={{
                    background: selectedMethod === m.id ? "rgba(224,48,48,0.15)" : "rgba(255,255,255,0.03)",
                    border: `2px solid ${selectedMethod === m.id ? "#e03030" : "rgba(255,255,255,0.08)"}`,
                    color: selectedMethod === m.id ? "#fff" : "#666",
                  }}>
                  {m.icon} {m.label}
                </button>
              ))}
            </div>

            {/* QRIS */}
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-3">QRIS</p>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {paymentMethods.filter(m => m.type === "qris").map(m => (
                <button key={m.id} onClick={() => setSelectedMethod(m.id)}
                  className="py-3 rounded-xl font-bold text-sm transition-all"
                  style={{
                    background: selectedMethod === m.id ? "rgba(224,48,48,0.15)" : "rgba(255,255,255,0.03)",
                    border: `2px solid ${selectedMethod === m.id ? "#e03030" : "rgba(255,255,255,0.08)"}`,
                    color: selectedMethod === m.id ? "#fff" : "#666",
                  }}>
                  {m.icon} {m.label}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 py-4 rounded-2xl font-bold text-gray-400 text-sm transition-all hover:text-white"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                ← Kembali
              </button>
              <button onClick={() => setStep(3)}
                className="flex-[2] py-4 rounded-2xl font-black text-white text-sm transition-all hover:brightness-110"
                style={{ background: "linear-gradient(135deg,#e03030,#a00020)" }}>
                Lanjut Konfirmasi →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: KONFIRMASI ── */}
        {step === 3 && (
          <div>
            <h2 className="text-white text-xl font-black mb-1">Konfirmasi Pembayaran</h2>
            <p className="text-gray-500 text-sm mb-5">Selesaikan pembayaran sesuai instruksi</p>

            {/* Order Summary */}
            <div className="rounded-2xl p-5 mb-5"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Ringkasan Pesanan</h3>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400 text-sm">Paket</span>
                <span className="text-white text-sm font-semibold">{plan?.label} Premium</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400 text-sm">Metode</span>
                <span className="text-white text-sm font-semibold">{method?.icon} {method?.label}</span>
              </div>
              <div className="border-t border-white/10 my-3" />
              <div className="flex justify-between">
                <span className="text-white font-bold">Total</span>
                <span className="text-red-400 font-black text-lg">{plan?.price}</span>
              </div>
            </div>

            {/* Payment Info */}
            {method?.type !== "qris" && (
              <div className="rounded-2xl p-5 mb-5"
                style={{ background: "rgba(26,110,189,0.1)", border: "1px solid rgba(26,110,189,0.25)" }}>
                <h3 className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
                  {method?.type === "bank" ? "Instruksi Transfer Bank" : "Instruksi E-Wallet"}
                </h3>
                <p className="text-gray-400 text-xs mb-1">
                  {method?.type === "bank" ? "Nama Bank" : "Platform"}
                </p>
                <p className="text-white font-bold mb-3">{method?.label}</p>
                <p className="text-gray-400 text-xs mb-1">
                  {method?.type === "bank" ? "Nomor Rekening" : "Nomor"}
                </p>
                <div className="flex items-center gap-3 mb-3">
                  <p className="text-white font-black text-xl tracking-widest">{method?.number}</p>
                </div>
                <p className="text-gray-400 text-xs mb-1">Atas Nama</p>
                <p className="text-white font-bold">{method?.name}</p>
                <div className="mt-3 p-3 rounded-xl"
                  style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}>
                  <p className="text-yellow-400 text-xs font-semibold">⚠️ Penting!</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Transfer tepat sebesar <span className="text-white font-bold">{plan?.price}</span>.
                    Simpan bukti transfer dan klik tombol di bawah setelah transfer.
                  </p>
                </div>
              </div>
            )}

            {/* QRIS */}
            {method?.type === "qris" && (
              <div className="rounded-2xl p-5 mb-5 text-center"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <h3 className="text-white font-bold mb-4">Scan QR Code</h3>
                <div className="w-48 h-48 rounded-2xl mx-auto flex items-center justify-center mb-3"
                  style={{ background: "#fff" }}>
                  {/* Dummy QR */}
                  <div className="grid grid-cols-8 gap-0.5 p-3">
                    {Array.from({length:64}).map((_,i) => (
                      <div key={i} className="w-4 h-4 rounded-sm"
                        style={{ background: Math.random() > 0.4 ? "#000" : "#fff" }} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-400 text-xs">Scan menggunakan GoPay, OVO, DANA, atau aplikasi bank apapun</p>
                <p className="text-white font-black text-lg mt-2">{plan?.price}</p>
              </div>
            )}

            {/* Note */}
            <Field
              label="Catatan (opsional)"
              placeholder="Misal: sudah transfer via BCA mobile"
              value={form.proofNote}
              onChange={e => setForm({...form, proofNote: e.target.value})}
            />

            <div className="flex gap-3">
              <button onClick={() => setStep(2)}
                className="flex-1 py-4 rounded-2xl font-bold text-gray-400 text-sm transition-all hover:text-white"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                ← Kembali
              </button>
              <button
                onClick={handlePay}
                disabled={loading}
                className="flex-[2] py-4 rounded-2xl font-black text-white text-sm transition-all hover:brightness-110 disabled:opacity-70"
                style={{ background: "linear-gradient(135deg,#e03030,#a00020)" }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Memproses...
                  </span>
                ) : "✓ Konfirmasi Pembayaran"}
              </button>
            </div>

            <p className="text-gray-600 text-xs text-center mt-4">
              🔒 Data pembayaran kamu aman dan terenkripsi
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
