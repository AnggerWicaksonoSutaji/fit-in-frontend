import React, { useEffect, useState } from "react";
import AdminApp from "./pages/admin/AdminApp";

function App() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.role) {
      setRole(user.role);
    }
  }, []);

  if (role === "admin") {
    return <AdminApp />;
  }

  return (
    <div style={{ color: "white", padding: 40 }}>
      <h1>Welcome FIT-IN</h1>
      <p>Login sebagai admin untuk membuka admin panel.</p>
    </div>
  );
}

export default App;