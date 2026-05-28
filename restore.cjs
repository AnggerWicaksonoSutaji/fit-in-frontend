const fs = require('fs');

let content = fs.readFileSync('old_FitInApp.jsx', 'utf8');

// 1. Change localhost:8000 to 127.0.0.1:8001
content = content.replace('http://localhost:8000/api', 'http://127.0.0.1:8001/api');

// 2. Add import AdminDashboard
content = content.replace('import DataDiriPage from "./pages/DataDiriPage";', 'import DataDiriPage from "./pages/DataDiriPage";\nimport AdminDashboard from "./pages/admin/AdminDashboard";');

// 3. Update handleLogin
const oldHandleLoginTry = `    try {
      // Γ£à Pakai axios ΓÇö lebih singkat dan otomatis parse JSON
      const { data } = await api.post("/login", {
        username: form.username,
        password: form.password,
      });

      // Simpan token & user ke localStorage
      localStorage.setItem("fitinToken", data.token);
      localStorage.setItem("fitinUser", JSON.stringify(data.user));`;

const newHandleLoginTry = `    try {
      let actualUsername = form.username;
      let isAdminAttempt = false;

      // Jika username berakhiran /admin, berarti ini mencoba login sebagai admin
      if (actualUsername.endsWith("/admin")) {
        isAdminAttempt = true;
        actualUsername = actualUsername.replace("/admin", "");
      }

      // Pakai axios
      const { data } = await api.post("/login", {
        username: actualUsername,
        password: form.password,
      });

      // Validasi tambahan: Jika mencoba login admin tapi rolenya bukan admin
      if (isAdminAttempt && data.user.role !== "admin") {
        setError("Akses ditolak: Akun ini bukan admin.");
        return;
      }

      // Simpan token & user ke localStorage
      localStorage.setItem("fitinToken", data.token);
      localStorage.setItem("fitinUser", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        onNavigate("admin");
        return;
      }`;

content = content.replace(oldHandleLoginTry, newHandleLoginTry);

// 4. Update App root state
const oldAppState = `  const [page, setPage] = useState(() => {
    const savedPage = sessionStorage.getItem("fitinCurrentPage");
    if (savedPage && ["dashboard", "payment", "data-diri"].includes(savedPage)) {
      return savedPage;
    }
    return "welcome";
  });

  useEffect(() => {
    if (["dashboard", "payment", "data-diri"].includes(page)) {
      sessionStorage.setItem("fitinCurrentPage", page);
    } else {
      sessionStorage.removeItem("fitinCurrentPage");
    }
  }, [page]);`;

const newAppState = `  const [page, setPage] = useState(() => {
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
  }, [page]);`;

content = content.replace(oldAppState, newAppState);

// 5. Update App render
const oldAppRender = `      {page === "data-diri" && <DataDiriPage onBack={() => setPage("dashboard")} onSuccess={() => setPage("dashboard")} />}
    </div>`;

const newAppRender = `      {page === "data-diri" && <DataDiriPage onBack={() => setPage("dashboard")} onSuccess={() => setPage("dashboard")} />}
      {page === "admin" && <AdminDashboard onLogout={handleLogout} />}
    </div>`;

content = content.replace(oldAppRender, newAppRender);

// Replace garbled characters due to encoding
content = content.replace(/ΓöÇΓöÇΓöÇ/g, '───');
content = content.replace(/ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ/g, '════════════════════════════════════════');
content = content.replace(/ΓÇö/g, '—');
content = content.replace(/Γ£à/g, '✅');
content = content.replace(/Γ£ô/g, '✓');

fs.writeFileSync('src/FitInApp.jsx', content);
console.log("Successfully restored FitInApp.jsx!");
