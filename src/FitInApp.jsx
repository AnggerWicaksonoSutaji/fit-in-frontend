import { useState, useEffect } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import Payment from "./Payment";
import DataDiriPage from "./pages/DataDiriPage";
import AdminApp from "./pages/admin/AdminApp";

/* ─── AXIOS BASE CONFIG ─── */
const api = axios.create({
baseURL: "http://127.0.0.1:8001/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/* ─── FIT-IN LOGO SVG ─── */
const FitInLogo = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 80 Q40 40 100 30 Q160 40 180 80 Q160 140 100 170 Q40 140 20 80Z"
      fill="url(#shieldGrad)" opacity="0.15" />
    <path d="M15 85 Q35 50 100 45 L85 110 Q50 105 15 85Z"
      fill="url(#redGrad)" opacity="0.9" />
    <path d="M185 85 Q165 50 100 45 L115 110 Q150 105 185 85Z"
      fill="url(#blueGrad)" opacity="0.9" />
    <path d="M85 110 Q100 170 100 170 Q100 170 115 110 L100 45Z"
      fill="url(#centerGrad)" />
    <ellipse cx="100" cy="82" rx="18" ry="14" fill="url(#eyeGrad)" />
    <ellipse cx="100" cy="82" rx="9" ry="7" fill="#1a0a0a" />
    <text x="100" y="138" textAnchor="middle"
      fontFamily="'Arial Black', sans-serif" fontSize="18"
      fontWeight="900" letterSpacing="3" fill="url(#textGrad)">FIT-IN</text>
    <defs>
      <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#e03030" />
        <stop offset="100%" stopColor="#1a6ebd" />
      </linearGradient>
      <linearGradient id="redGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ff2020" />
        <stop offset="100%" stopColor="#c0001a" />
      </linearGradient>
      <linearGradient id="blueGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1a6ebd" />
        <stop offset="100%" stopColor="#0a3a7a" />
      </linearGradient>
      <linearGradient id="centerGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e03030" />
        <stop offset="50%" stopColor="#8b1a8b" />
        <stop offset="100%" stopColor="#1a6ebd" />
      </linearGradient>
      <radialGradient id="eyeGrad" cx="50%" cy="40%">
        <stop offset="0%" stopColor="#ff5555" />
        <stop offset="100%" stopColor="#cc0000" />
      </radialGradient>
      <linearGradient id="textGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#e03030" />
        <stop offset="50%" stopColor="#cc44cc" />
        <stop offset="100%" stopColor="#1a6ebd" />
      </linearGradient>
    </defs>
  </svg>
);

/* ================= BACKGROUND ================= */

const DarkBg = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full">{children}</div>
    </div>
  );
};

/* ================= INPUT ================= */

const InputField = ({
  placeholder,
  type = "text",
  value,
  onChange,
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white mb-4 outline-none focus:border-red-500"
    />
  );
};

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

const WelcomePage = ({ onNavigate }) => {
  return (
    <DarkBg>
      <div className="max-w-md mx-auto text-center px-6">
        <div className="mb-8 flex justify-center">
          <FitInLogo />
        </div>

        <h1 className="text-4xl font-bold mb-3">FIT-IN</h1>

        <p className="text-gray-400 mb-10">
          Welcome to Fitness Intelligent App
        </p>

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
};

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

      /* ================= ADMIN ================= */

      if (data.user.role === "admin") {
        onNavigate("admin");
        return;
      }

      /* ================= USER ================= */

      onNavigate("dashboard");

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

        <h1 className="text-3xl font-bold text-center mb-8">
          LOGIN
        </h1>

        <ErrorBox message={error} />

        <InputField
          placeholder="Email / Username"
          value={form.username}
          onChange={(e) =>
            setForm({
              ...form,
              username: e.target.value,
            })
          }
        />

        <InputField
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
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

/* ════════════════════════════════════════
   PAGE 3 — REGISTER
════════════════════════════════════════ */
const RegisterPage = ({ onNavigate }) => {

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {

    if (
      !form.username ||
      !form.email ||
      !form.password ||
      !form.confirm
    ) {
      setError("Semua field wajib diisi");
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

    try {

      setLoading(true);

      await api.post("/register", {
        username: form.username,
        email: form.email,
        password: form.password,
        password_confirmation: form.confirm,
      });
alert("Register berhasil! Silakan login.");
onNavigate("login");

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

        <h1 className="text-3xl font-bold text-center mb-8">
          REGISTER
        </h1>

        <ErrorBox message={error} />

        <InputField
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({
              ...form,
              username: e.target.value,
            })
          }
        />

        <InputField
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <InputField
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <InputField
          type="password"
          placeholder="Confirm Password"
          value={form.confirm}
          onChange={(e) =>
            setForm({
              ...form,
              confirm: e.target.value,
            })
          }
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

export default function App() {

  const [page, setPage] = useState("welcome");

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
      await api.post(
        "/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  } catch (err) {
    console.error(err);
  }

  localStorage.removeItem("fitinToken");
  localStorage.removeItem("fitinUser");
  localStorage.removeItem("fitinPremium");
  localStorage.removeItem("fitinPlan");
  localStorage.removeItem("fitinProfile");
  localStorage.removeItem("fitinNutrition");

  sessionStorage.removeItem("fitinCurrentPage");
  sessionStorage.removeItem("fitinDashboardTab");

  localStorage.clear();
  sessionStorage.clear();

  setPage("welcome");
};
return (
  <div className="min-h-screen">
    ...
    {page === "admin" && (
      <AdminApp
        onLogout={handleLogout}
      />
    )}
  </div>
);
};