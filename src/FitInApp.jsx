import { useState, useEffect } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import Payment from "./Payment";
import DataDiriPage from "./pages/DataDiriPage";
import AdminApp from "./pages/admin/AdminApp";
import bgWelcome from "./assets/bg-wp.png";
import bgLogin from "./assets/bg-login.png";
import bgRegister from "./assets/bg-register.png";
import logoPng from "./assets/logo.png";

/* ─── AXIOS BASE CONFIG ─── */
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/* ─── FIT-IN LOGO PNG ─── */
const FitInLogo = ({ size = 120 }) => (
  <img src={logoPng} alt="Fit-In Logo" style={{ width: size, height: size, objectFit: 'contain' }} className="drop-shadow-lg" />
);

/* ─── ICONS ─── */
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="15,18 9,12 15,6" />
  </svg>
);

/* ─── DARK BACKGROUND ─── */
const DarkBg = ({ children, variant = "default" }) => {
  const gradients = {
    default: "from-neutral-950 via-neutral-900 to-neutral-950",
    welcome: "from-neutral-950 via-neutral-900 to-neutral-950",
    login: "from-black via-neutral-900 to-neutral-950",
    register: "from-neutral-950 via-stone-900 to-black",
  };
  return (
    <div
      className={`relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br ${gradients[variant]}`}
      style={{ fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif" }}
    >
      {["welcome", "login", "register"].includes(variant) && (
        <>
          <div
            className="absolute inset-0 z-0 bg-no-repeat bg-[length:100%_100%] md:bg-cover md:bg-center"
            style={{
              backgroundImage: `url(${variant === "welcome" ? bgWelcome :
                  variant === "login" ? bgLogin :
                    bgRegister
                })`
            }}
          />
          <div className="absolute inset-0 z-0 bg-black/60" />
        </>
      )}
      <div className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)" }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(200,20,20,0.15) 0%, transparent 70%)" }} />
      <div className="z-10 w-full">{children}</div>
    </div>
  );
};

/* ─── INPUT FIELD ─── */
const InputField = ({ icon, placeholder, type = "text", value, onChange }) => (
  <div className="relative flex items-center gap-3 mb-5">
    <span className="absolute left-0 bottom-2 text-gray-500">{icon}</span>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full bg-transparent border-b border-red-700 pl-8 pb-2 pt-1 text-gray-200
        placeholder-gray-500 focus:outline-none focus:border-red-400 transition-colors duration-300
        text-sm tracking-wide"
    />
  </div>
);

/* ─── ERROR BOX ─── */
const ErrorBox = ({ message }) =>
  message ? (
    <div className="bg-red-900/30 border border-red-700 rounded px-3 py-2 mb-3">
      <p className="text-red-400 text-xs">{message}</p>
    </div>
  ) : null;

/* ════════════════════════════════════════
   PAGE 1 — WELCOME
════════════════════════════════════════ */
const WelcomePage = ({ onNavigate }) => (
  <DarkBg variant="welcome">
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <h1 className="text-4xl md:text-5xl font-black tracking-[0.2em] mb-4 uppercase"
        style={{
          background: "linear-gradient(90deg, #e03030, #cc44cc, #1a6ebd)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 4px 16px rgba(224,48,48,0.6))"
        }}>
        FIT-IN
      </h1>
      <p className="text-gray-400 text-sm tracking-widest mb-6 uppercase">Welcome to</p>
      <div className="mb-8" style={{ filter: "drop-shadow(0 0 24px rgba(200,30,30,0.4))" }}>
        <FitInLogo size={140} />
      </div>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={() => onNavigate("login")}
          className="w-full py-3 rounded font-bold tracking-[0.2em] text-sm uppercase
            transition-all duration-300 hover:brightness-110 hover:scale-105 active:scale-95"
          style={{ background: "linear-gradient(135deg, #c0001a, #8b0000)", color: "#fff", boxShadow: "0 4px 20px rgba(200,0,30,0.4)" }}
        >
          LOGIN
        </button>
        <button
          onClick={() => onNavigate("register")}
          className="w-full py-3 rounded font-bold tracking-[0.2em] text-sm uppercase
            transition-all duration-300 hover:brightness-110 hover:scale-105 active:scale-95"
          style={{ background: "linear-gradient(135deg, #1a4fa0, #0a2a60)", color: "#fff", boxShadow: "0 4px 20px rgba(30,80,200,0.4)" }}
        >
          REGISTER
        </button>
      </div>
    </div>
  </DarkBg>
);

/* ════════════════════════════════════════
   PAGE 2 — LOGIN
════════════════════════════════════════ */
const LoginPage = ({ onNavigate }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!form.username || !form.password) {
      setError("Username dan password wajib diisi.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      let actualUsername = form.username;
      let isAdminAttempt = false;

      // Jika username berakhiran /admin, berarti ini mencoba login sebagai admin
      if (actualUsername.endsWith("/admin")) {
        isAdminAttempt = true;
        actualUsername = actualUsername.replace("/admin", "");
      }

      const { data } = await api.post("/login", {
        username: actualUsername,
        password: form.password,
      });

      // Validasi tambahan: Jika mencoba login admin tapi rolenya bukan admin
      if (isAdminAttempt && data.user.role !== "admin") {
        setError("Akses ditolak: Akun ini bukan admin.");
        setLoading(false);
        return;
      }

      // Simpan token & user ke localStorage
      localStorage.setItem("fitinToken", data.token);
      localStorage.setItem("fitinUser", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        onNavigate("admin");
      } else {
        let isPremium = data.user.role === "premium";
        if (!isPremium) {
          try {
            const statusRes = await api.get("/payment/status", {
              headers: { Authorization: `Bearer ${data.token}` },
            });
            if (statusRes.data.is_premium) {
              isPremium = true;
            }
          } catch { }
        }

        if (isPremium) {
          localStorage.setItem("fitinPremium", "true");
          try {
            const profileRes = await api.get("/profile", {
              headers: { Authorization: `Bearer ${data.token}` },
            });
            if (profileRes.data.profile) {
              localStorage.setItem("fitinProfile", JSON.stringify({
                age: String(profileRes.data.profile.umur),
                gender: profileRes.data.profile.jenis_kelamin === "Laki-laki" ? "male" : "female",
                weight: String(profileRes.data.profile.berat_badan),
                height: String(profileRes.data.profile.tinggi_badan),
                activityLevel: profileRes.data.profile.tingkat_aktivitas,
                goal: profileRes.data.profile.goal,
              }));
            }
            if (profileRes.data.program) {
              localStorage.setItem("fitinNutrition", JSON.stringify({
                tdee: profileRes.data.program.tdee,
                targetCal: profileRes.data.program.target_kalori,
                protein: profileRes.data.program.protein_g,
                carbs: profileRes.data.program.karbo_g,
                fat: profileRes.data.program.lemak_g,
              }));
            }
          } catch { }
        } else {
          localStorage.removeItem("fitinPremium");
        }
        onNavigate("dashboard");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Login gagal.");
      } else if (err.request) {
        setError("Tidak bisa terhubung ke server.");
      } else {
        setError("Terjadi kesalahan. Coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DarkBg variant="login">
      <button
        onClick={() => onNavigate("welcome")}
        className="absolute top-6 left-6 md:top-8 md:left-8 z-20 flex items-center justify-center w-10 h-10
          rounded-full border-2 border-neutral-400 bg-neutral-900/90 backdrop-blur-sm text-white hover:border-red-500 hover:text-red-400 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md"
      >
        <BackIcon />
      </button>

      <div className="flex flex-col items-center justify-center px-8 py-12 text-center max-w-sm mx-auto">
        <div className="mb-4" style={{ filter: "drop-shadow(0 0 20px rgba(200,30,30,0.5))" }}>
          <FitInLogo size={130} />
        </div>

        <h1 className="text-4xl md:text-5xl font-black tracking-[0.2em] mb-8 uppercase"
          style={{
            background: "linear-gradient(90deg, #e03030, #cc44cc, #1a6ebd)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 4px 16px rgba(224,48,48,0.6))"
          }}>
          LOGIN
        </h1>

        <div className="w-full">
          <InputField
            icon={<UserIcon />}
            placeholder="username atau email"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <InputField
            icon={<LockIcon />}
            placeholder="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <ErrorBox message={error} />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 rounded-lg font-bold tracking-[0.2em] text-sm uppercase mt-2
              transition-all duration-300 hover:brightness-110 hover:scale-105 active:scale-95 disabled:opacity-60"
            style={{
              background: loading ? "#555" : "linear-gradient(135deg, #e03030, #a00020)",
              color: "#fff",
              boxShadow: "0 4px 20px rgba(200,0,30,0.45)",
            }}
          >
            {loading ? "Memproses..." : "Login"}
          </button>

          <p className="text-gray-600 text-xs mt-6">
            Belum punya akun?{" "}
            <span
              className="text-blue-400 cursor-pointer hover:text-blue-300 transition-colors"
              onClick={() => onNavigate("register")}
            >
              Register di sini
            </span>
          </p>
        </div>
      </div>
    </DarkBg>
  );
};

/* ════════════════════════════════════════
   PAGE 3 — REGISTER
════════════════════════════════════════ */
const RegisterPage = ({ onNavigate }) => {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    if (!form.username || !form.email || !form.password || !form.confirm) {
      setError("Semua field wajib diisi.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Password dan konfirmasi tidak cocok.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/register", {
        username: form.username,
        email: form.email,
        password: form.password,
        password_confirmation: form.confirm,
      });

      localStorage.setItem("fitinToken", data.token);
      localStorage.setItem("fitinUser", JSON.stringify(data.user));

      setSuccess(true);
      setTimeout(() => onNavigate("login"), 2000);

    } catch (err) {
      if (err.response) {
        const errors = err.response.data.errors;
        if (errors) {
          const firstError = Object.values(errors)[0][0];
          setError(firstError);
        } else {
          setError(err.response.data.message || "Registrasi gagal.");
        }
      } else if (err.request) {
        setError("Tidak bisa terhubung ke server.");
      } else {
        setError("Terjadi kesalahan. Coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DarkBg variant="register">
      <button
        onClick={() => onNavigate("welcome")}
        className="absolute top-6 left-6 md:top-8 md:left-8 z-20 flex items-center justify-center w-10 h-10
          rounded-full border-2 border-neutral-400 bg-neutral-900/90 backdrop-blur-sm text-white hover:border-blue-500 hover:text-blue-400 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md"
      >
        <BackIcon />
      </button>

      <div className="flex flex-col items-center justify-center px-8 py-10 text-center max-w-sm mx-auto">
        <div className="mb-4" style={{ filter: "drop-shadow(0 0 20px rgba(200,30,30,0.5))" }}>
          <FitInLogo size={120} />
        </div>

        <h1 className="text-4xl md:text-5xl font-black tracking-[0.2em] mb-6 uppercase"
          style={{
            background: "linear-gradient(90deg, #e03030, #cc44cc, #1a6ebd)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 4px 16px rgba(224,48,48,0.6))"
          }}>
          REGISTER
        </h1>

        {success ? (
          <div className="text-center py-8">
            <div className="text-green-400 text-4xl mb-3">✓</div>
            <p className="text-green-400 text-sm font-semibold">Registrasi berhasil!</p>
            <p className="text-gray-500 text-xs mt-1">Mengalihkan ke halaman login...</p>
          </div>
        ) : (
          <div className="w-full">
            <InputField
              icon={<UserIcon />}
              placeholder="username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <InputField
              icon={<EmailIcon />}
              placeholder="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <InputField
              icon={<LockIcon />}
              placeholder="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <InputField
              icon={<LockIcon />}
              placeholder="confirm password"
              type="password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            />

            <ErrorBox message={error} />

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold tracking-[0.2em] text-sm uppercase mt-2
                transition-all duration-300 hover:brightness-110 hover:scale-105 active:scale-95 disabled:opacity-60"
              style={{
                background: loading ? "#555" : "linear-gradient(135deg, #1a4fa0, #0a2060)",
                color: "#fff",
                boxShadow: "0 4px 20px rgba(30,80,200,0.45)",
              }}
            >
              {loading ? "Memproses..." : "REGISTER"}
            </button>

            <p className="text-gray-600 text-xs mt-5">
              Sudah punya akun?{" "}
              <span
                className="text-red-400 cursor-pointer hover:text-red-300 transition-colors"
                onClick={() => onNavigate("login")}
              >
                Login di sini
              </span>
            </p>
          </div>
        )}
      </div>
    </DarkBg>
  );
};

/* ════════════════════════════════════════
   APP ROOT
════════════════════════════════════════ */
export default function FitInApp() {
  const [page, setPage] = useState(() => {
    const savedPage = sessionStorage.getItem("fitinCurrentPage");
    if (savedPage && ["dashboard", "payment", "data-diri", "admin"].includes(savedPage)) {
      return savedPage;
    }
    const user = localStorage.getItem("fitinUser");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed.role === "admin") return "admin";
        return "dashboard";
      } catch { }
    }
    return "welcome";
  });

  useEffect(() => {
    if (["dashboard", "payment", "data-diri", "admin"].includes(page)) {
      sessionStorage.setItem("fitinCurrentPage", page);
    } else {
      sessionStorage.removeItem("fitinCurrentPage");
    }
  }, [page]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("fitinToken");
      if (token) {
        await api.post("/logout", {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch { }

    localStorage.removeItem("fitinToken");
    localStorage.removeItem("fitinUser");
    localStorage.removeItem("fitinPremium");
    localStorage.removeItem("fitinPlan");
    localStorage.removeItem("fitinProfile");
    localStorage.removeItem("fitinNutrition");
    sessionStorage.removeItem("fitinCurrentPage");
    sessionStorage.removeItem("fitinDashboardTab");
    setPage("welcome");
  };

  return (
    <div className="min-h-screen">
      {page === "welcome" && <WelcomePage onNavigate={setPage} />}
      {page === "login" && <LoginPage onNavigate={setPage} />}
      {page === "register" && <RegisterPage onNavigate={setPage} />}
      {page === "dashboard" && <Dashboard onLogout={handleLogout} onNavigate={setPage} />}
      {page === "payment" && <Payment onBack={() => setPage("dashboard")} onSuccess={(nextPage) => setPage(nextPage || "dashboard")} />}
      {page === "data-diri" && <DataDiriPage onBack={() => setPage("dashboard")} onSuccess={() => setPage("dashboard")} />}
      {page === "admin" && <AdminApp onLogout={handleLogout} />}
    </div>
  );
}
