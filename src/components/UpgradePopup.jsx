/**
 * UpgradePopup.jsx
 * ─────────────────────────────────────────────────
 * Komponen modal/popup yang ditampilkan secara otomatis
 * saat pengguna non-premium pertama kali membuka dashboard.
 *
 * Tujuan:
 *   - Menampilkan informasi keuntungan berlangganan premium
 *   - Mendorong pengguna untuk upgrade ke paket premium
 *
 * Menampilkan:
 *   - Judul dan deskripsi singkat
 *   - Daftar fitur premium (5 fitur)
 *   - Tombol "Klik disini untuk Upgrade"
 *   - Tombol X untuk menutup popup
 *
 * Props:
 *   - onClose   (function) : Callback saat popup ditutup (klik tombol X)
 *   - onUpgrade (function) : Callback saat tombol upgrade diklik → navigasi ke pembayaran
 * ─────────────────────────────────────────────────
 */

// Daftar fitur premium yang akan ditampilkan di popup
const premiumFeatures = [
  {
    title: "Pilih Fokus Program Sesuai Tujuanmu",
    desc: "Tentukan jalur fitness kamu: Bulking untuk membangun otot, Cutting untuk mengurangi lemak, atau Maintenance untuk menjaga bentuk ideal.",
  },
  {
    title: "Workout Planner Otomatis",
    desc: "Dapatkan jadwal latihan yang langsung disesuaikan dengan durasi langgananmu, tanpa ribet, tanpa bingung.",
  },
  {
    title: "Video Workout Terarah",
    desc: "Ikuti video latihan yang sudah disusun sesuai planner, jadi kamu tahu persis apa yang harus dilakukan setiap hari.",
  },
  {
    title: "Pantau Progress Secara Real-Time",
    desc: "Lihat perkembangan workout kamu dengan tampilan visual yang memotivasi dan mudah dipahami.",
  },
  {
    title: "Kontrol Nutrisi Lebih Akurat",
    desc: "Hitung dan atur kebutuhan kalori, gula, dan protein sesuai target tubuhmu — semua dalam satu platform.",
  },
];

const UpgradePopup = ({ onClose, onUpgrade }) => (
  /* Overlay gelap dengan blur di belakang modal */
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
  >
    {/* ── Kotak Modal ── */}
    <div
      className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
      style={{ background: "#fff", maxHeight: "90vh", overflowY: "auto" }}
    >
      {/* ── Tombol Tutup (X) ── */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all z-10"
        style={{ border: "1px solid #e5e7eb" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="p-8 text-center">
        {/* ── Judul Modal ── */}
        <h2
          className="text-2xl font-black mb-3 uppercase tracking-wide italic"
          style={{
            background: "linear-gradient(135deg, #e03030, #cc44cc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          UPGRADE KE FIT-IN PREMIUM
        </h2>

        {/* ── Deskripsi Singkat ── */}
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Ambil kendali penuh atas transformasi tubuhmu dengan fitur eksklusif yang
          dirancang khusus untuk hasil yang lebih terarah dan maksimal.
        </p>

        {/* ── Daftar Fitur Premium ── */}
        <div className="flex flex-col gap-3 mb-7">
          {premiumFeatures.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl px-5 py-3 text-left"
              style={{ background: "linear-gradient(135deg, #e03030, #c0001a)" }}
            >
              {/* Judul fitur */}
              <p className="text-white font-bold text-sm italic">{f.title}</p>
              {/* Deskripsi fitur */}
              <p className="text-red-100 text-xs mt-1 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Tombol CTA (Call To Action) ── */}
        <button
          onClick={onUpgrade}
          className="w-full py-4 rounded-2xl font-black text-gray-700 text-base tracking-wide transition-all hover:brightness-95 hover:scale-[1.02] active:scale-95"
          style={{
            background: "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
            border: "2px solid #d1d5db",
          }}
        >
          Klik disini untuk Upgrade
        </button>
      </div>
    </div>
  </div>
);

export default UpgradePopup;
