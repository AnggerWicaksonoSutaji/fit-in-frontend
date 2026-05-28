import { useState, useEffect } from "react";
import axios from "axios";

import Dashboard from "./Dashboard";
import Payment from "./Payment";
import DataDiriPage from "./pages/DataDiriPage";
import AdminApp from "./pages/admin/AdminApp"; // ← pakai AdminApp baru

/* ================= AXIOS ================= */

const api = axios.create({
  baseURL: "http://127.0.0.1:8001/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/* ================= LOGO ================= */

const FitInLogo = ({ size = 120 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="100" cy="100" r="80" fill="#111827" />
    <path
      d="M60 70C80 40 120 40 140 70"
      stroke="#ef4444"
      strokeWidth="12"
      strokeLinecap="round"
    />
    <path
      d="M60 130C80 160 120 160 140 130"
      stroke="#3b82f6"
      strokeWidth="12"
      strokeLinecap="round"
    />
    <circle cx="100" cy="100" r="15" fill="#ef4444" />
    <text
      x="100"
      y="190"
      textAnchor="middle"
      fill="white"
      fontSize="20"
      fontWeight="bold"
    >
      FIT-IN
    </text>
  </svg>
);

/* ================= BACKGROUND ================= */

const DarkBg = ({ children }) => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center">
    <div className="w-full">{children}</div>
  </div>
);

/* ================= INPUT ================= */

const InputField = ({ placeholder, type = "text", value, onChange }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white mb-4 outline-none focus:border-red-500"
  />
);

/* ================= ERROR ================= */

const ErrorBox = ({ message }) => {
  if (!message) return null;
  return (
    <div className="bg-red-900/40 border border-red-500 rounded-lg p-3 mb-4 text-sm text-red-300">
      {message}
    </div>
  );
};

/* ================= WELCOME ================= */

const WelcomePage = ({ onNavigate }) => (
  <DarkBg>
    <div className="max-w-md mx-auto text-center px-6">
      <div className="mb-8 flex justify-center">
        <FitInLogo />
      </div>
      <h1 className="text-4xl font-bold mb-3">FIT-IN</h1>
      <p className="text-gray-400 mb-10">Welcome to Fitness Intelligent App</p>
      <div className="space-y-4">
        <button
          onClick={() => onNavigate("login")}
          className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold transition"
        >
          LOGIN
        </button>
        <button
          onClick={() => onNavigate("register")}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition"
        >
          REGISTER
        </button>
      </div>
    </div>
  </DarkBg>
);

/* ================= LOGIN ================= */

const LoginPage = ({ onNavigate }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!form.username || !form.password) {
      setError("Semua field wajib diisi");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/login", {
        username: form.username,
        password: form.password,
      });
      const data = response.data;
      localStorage.setItem("fitinToken", data.token);
      localStorage.setItem("fitinUser", JSON.stringify(data.user));

      // Cek role → arahkan ke halaman yang sesuai
      if (data.user.role === "admin") {
        onNavigate("admin");
      } else {
        onNavigate("dashboard");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Login gagal");
      } else {
        setError("Server backend belum berjalan");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DarkBg>
      <div className="max-w-md mx-auto px-6">
        <button
          onClick={() => onNavigate("welcome")}
          className="mb-8 text-gray-400 hover:text-white"
        >
          ← Kembali
        </button>
        <div className="flex justify-center mb-6">
          <FitInLogo />
        </div>
        <h1 className="text-3xl font-bold text-center mb-8">LOGIN</h1>
        <ErrorBox message={error} />
        <InputField
          placeholder="Email"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <InputField
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold transition"
        >
          {loading ? "Loading..." : "LOGIN"}
        </button>
      </div>
    </DarkBg>
  );
};

/* ================= REGISTER ================= */

const RegisterPage = ({ onNavigate }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("Semua field wajib diisi");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Password tidak cocok");
      return;
    }
    try {
      setLoading(true);
      await api.post("/register", {
        username: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.confirm,
      });
      alert("Register berhasil! Silakan login.");
      onNavigate("login");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Register gagal");
      } else {
        setError("Server backend belum berjalan");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DarkBg>
      <div className="max-w-md mx-auto px-6">
        <button
          onClick={() => onNavigate("welcome")}
          className="mb-8 text-gray-400 hover:text-white"
        >
          ← Kembali
        </button>
        <div className="flex justify-center mb-6">
          <FitInLogo />
        </div>
        <h1 className="text-3xl font-bold text-center mb-8">REGISTER</h1>
        <ErrorBox message={error} />
        <InputField
          placeholder="Nama Lengkap"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <InputField
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <InputField
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <InputField
          type="password"
          placeholder="Confirm Password"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
        />
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition"
        >
          {loading ? "Loading..." : "REGISTER"}
        </button>
      </div>
    </DarkBg>
  );
};

/* ================= APP ROOT ================= */

export default function FitInApp() {
  const [page, setPage] = useState("welcome");

  // Cek localStorage saat pertama buka — kalau sudah login, langsung masuk
  useEffect(() => {
    const user = localStorage.getItem("fitinUser");
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.role === "admin") {
        setPage("admin");
      } else {
        setPage("dashboard");
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("fitinToken");
      if (token) {
        await api.post("/logout", {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {}
    localStorage.clear();
    setPage("welcome");
  };

  return (
    <div className="min-h-screen">

      {/* ── HALAMAN USER BIASA ── */}
      {page === "welcome"   && <WelcomePage onNavigate={setPage} />}
      {page === "login"     && <LoginPage onNavigate={setPage} />}
      {page === "register"  && <RegisterPage onNavigate={setPage} />}
      {page === "dashboard" && <Dashboard onLogout={handleLogout} onNavigate={setPage} />}
      {page === "payment"   && <Payment onBack={() => setPage("dashboard")} />}
      {page === "data-diri" && <DataDiriPage onBack={() => setPage("dashboard")} />}

      {/* ── HALAMAN ADMIN ── */}
      {/* Hanya masuk ke sini kalau role === "admin" saat login */}
      {page === "admin" && (
        <AdminApp onLogout={handleLogout} />
      )}

    </div>
  );
}