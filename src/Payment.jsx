import { useState } from "react";
import axios from "axios";
import logoPng from "./assets/logo.png";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

/* ── Logo ── */
const Logo = ({ size = 36 }) => (
  <img src={logoPng} alt="Fit-In Logo" style={{ width: size, height: size, objectFit: 'contain' }} className="drop-shadow-lg" />
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





/* ════════════════════════════════════════
   PAYMENT PAGE
════════════════════════════════════════ */
export default function Payment({ onBack, onSuccess }) {
  const [selectedPlan, setSelectedPlan] = useState("quarterly");
  const [step, setStep] = useState(1); // 1=pilih, 2=sukses
  const [loading, setLoading] = useState(false);

  const plan = plans.find(p => p.id === selectedPlan);

  const handlePay = async () => {
    setLoading(true);
    try {
      // Ambil token login dari localStorage untuk dipakai sebagai identitas saat request ke backend
      const token = localStorage.getItem("fitinToken");

      // ─── LANGKAH 1: Ambil daftar paket dari backend ───────────────────────────
      // Kita perlu tahu ID paket di database (bukan nama frontendnya)
      // Contoh: "quarterly" di FE = "3 Bulan" di DB dengan id=2
      const { data: packages } = await api.get("/packages", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Cocokkan pilihan user (monthly/quarterly/yearly) ke nama paket di database
      const planMap = { monthly: "Bulanan", quarterly: "3 Bulan", yearly: "Tahunan" };
      const matchedPaket = packages.find(p => p.nama_paket === planMap[selectedPlan]);
      const paketId = matchedPaket ? matchedPaket.id : packages[0]?.id || 1;

      // ─── LANGKAH 2: Minta backend buat transaksi & token Midtrans ─────────────
      // Backend akan:
      //   a) Buat record di tabel 'transactions' dengan status 'pending'
      //   b) Menghubungi server Midtrans dan minta 'snap_token'
      //   c) Kembalikan snap_token ke FE
      const { data: checkoutData } = await api.post("/payment/checkout", { paket_id: paketId }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ─── LANGKAH 3: Validasi bahwa script Midtrans Snap sudah ter-load ────────
      // Script Midtrans dimuat dari CDN di index.html:
      // <script src="https://app.sandbox.midtrans.com/snap/snap.js" ...></script>
      // Jika tidak ada internet atau diblokir ad-blocker, window.snap tidak akan ada
      if (!window.snap) {
        alert("Gagal memproses pembayaran: Script Midtrans tidak ditemukan. Pastikan Anda terhubung ke internet dan tidak menggunakan Ad-Blocker yang memblokir script pembayaran.");
        setLoading(false);
        return;
      }

      // ─── LANGKAH 4: Buka popup pembayaran Midtrans Snap ──────────────────────
      // window.snap.pay() adalah fungsi dari library Midtrans
      // snap_token adalah "tiket unik" yang sudah dibuat backend untuk transaksi ini
      // Midtrans akan tampilkan popup: pilih metode bayar (QRIS, BCA, dll)
      window.snap.pay(checkoutData.snap_token, {

        // ─── Callback: dipanggil otomatis jika pembayaran BERHASIL ───────────
        onSuccess: async function () {
          // Simpan status premium ke localStorage agar aplikasi langsung tahu user sudah premium
          localStorage.setItem("fitinPremium", "true");
          localStorage.setItem("fitinPlan", selectedPlan);

          // Update data user di localStorage jika ada data user baru dari backend
          if (checkoutData.user) {
            localStorage.setItem("fitinUser", JSON.stringify(checkoutData.user));
          }

          // ─── Catatan Penting: Mengapa ada /payment/success manual? ───────────
          // Normalnya, Midtrans mengirim notifikasi ke endpoint /payment/webhook kita
          // TAPI webhook butuh URL publik yang bisa diakses Midtrans dari internet
          // Karena kita masih di localhost (tidak punya URL publik), webhook tidak bisa masuk
          // Solusi: kita update manual ke backend setelah onSuccess dipanggil
          try {
            await api.post("/payment/success", {
              transaction_id: checkoutData.transaction.id
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });
          } catch (err) {
            console.error("Gagal update status di backend", err);
          }

          setStep(2); // Pindah ke tampilan halaman sukses
        },

        // ─── Callback: dipanggil jika pembayaran MASIH MENUNGGU (transfer bank) ─
        onPending: function (result) {
          // Contoh: user pilih transfer bank, menunggu konfirmasi
          console.log("Payment pending:", result);
        },

        // ─── Callback: dipanggil jika pembayaran GAGAL ───────────────────────
        onError: function (result) {
          console.error("Payment error:", result);
          alert("Pembayaran gagal!");
        },

        // ─── Callback: dipanggil jika user MENUTUP popup tanpa bayar ─────────
        onClose: function () {
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
            onClick={() => onSuccess("data-diri")}
            className="w-full py-4 rounded-2xl font-black text-white text-sm tracking-wide transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg,#e03030,#a00020)" }}>
            Lengkapi Data Diri →
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
          {[1, 2].map(s => (
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
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{ borderColor: selectedPlan === p.id ? p.color : "#444" }}>
                      {selectedPlan === p.id && (
                        <div className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-bold">{p.label}</p>
                        {p.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black"
                            style={{ background: p.color, color: "#fff" }}>
                            {p.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs mt-0.5">Akses penuh semua fitur premium</p>
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
