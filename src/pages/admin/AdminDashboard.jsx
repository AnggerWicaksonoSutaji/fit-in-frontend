import React, { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000/api/admin";

const [dashboard, setDashboard] = useState({
  total_users: 0,
  workout_programs: 0,
  premium_users: 0,
});

const [users, setUsers] = useState([]);

useEffect(() => {
  const token = localStorage.getItem("fitinToken");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  fetch("http://127.0.0.1:8000/api/admin/dashboard", { headers })
    .then((res) => res.json())
    .then((data) => {
      setDashboard(data);
    })
    .catch((err) => console.error(err));

  fetch("http://127.0.0.1:8000/api/admin/users", { headers })
    .then((res) => res.json())
    .then((data) => {
      setUsers(data);
    })
    .catch((err) => console.error(err));

}, []);

return (
  <div
    style={{
      minHeight: "100vh",
      background: "#020617",
      color: "white",
      padding: "40px",
      fontFamily: "'Poppins', sans-serif",
    }}
  >

    {/* HEADER */}

    <div
      style={{
        marginBottom: "40px",
      }}
    >
      <h1
        style={{
          fontSize: "42px",
          fontWeight: "700",
          marginBottom: "10px",
          background: "linear-gradient(to right, #38bdf8, #ef4444)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        FIT-IN ADMIN
      </h1>

      <p
        style={{
          color: "#94a3b8",
          fontSize: "16px",
        }}
      >
        Monitor user activity and manage FIT-IN system.
      </p>

      <button
        onClick={onLogout}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Logout Admin
      </button>
    </div>

    {/* CARDS */}

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "25px",
        marginBottom: "40px",
      }}
    >

      {/* TOTAL USER */}

      <div style={cardStyle}>
        <p style={labelStyle}>Total Users</p>

        <h2 style={numberBlue}>
          {dashboard.total_users}
        </h2>
      </div>

      {/* WORKOUT */}

      <div style={cardStyle}>
        <p style={labelStyle}>Workout Programs</p>

        <h2 style={numberRed}>
          {dashboard.workout_programs}
        </h2>
      </div>

      {/* PREMIUM */}

      <div style={cardStyle}>
        <p style={labelStyle}>Premium Users</p>

        <h2 style={numberCyan}>
          {dashboard.premium_users}
        </h2>
      </div>

    </div>

    {/* TABLE */}

    <div
      style={{
        background: "rgba(15,23,42,0.7)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "24px",
        padding: "25px",
        backdropFilter: "blur(10px)",
        boxShadow: "0 0 30px rgba(0,0,0,0.3)",
      }}
    >

      <h2
        style={{
          marginBottom: "20px",
          fontSize: "24px",
          fontWeight: "600",
          color: "#38bdf8",
        }}
      >
        User Management
      </h2>

      <table
        width="100%"
        style={{
          borderCollapse: "collapse",
        }}
      >

        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Role</th>
          </tr>
        </thead>

        <tbody>

          {users.map((user) => (
            <tr
              key={user.id}
              style={{
                transition: "0.3s",
              }}
            >
              <td style={tdStyle}>{user.id}</td>
              <td style={tdStyle}>{user.name}</td>
              <td style={tdStyle}>{user.email}</td>

              <td style={tdStyle}>
                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: "30px",
                    background:
                      user.role === "admin"
                        ? "#ef4444"
                        : user.role === "premium"
                          ? "#06b6d4"
                          : "#334155",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  {user.role}
                </span>
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>

  </div>
);
}

/* CARD */

const cardStyle = {
  background: "rgba(15,23,42,0.7)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "24px",
  padding: "30px",
  backdropFilter: "blur(10px)",
  boxShadow: "0 0 30px rgba(0,0,0,0.25)",
};

const labelStyle = {
  color: "#94a3b8",
  fontSize: "15px",
  marginBottom: "10px",
};

const numberBlue = {
  fontSize: "42px",
  fontWeight: "700",
  color: "#38bdf8",
};

const numberRed = {
  fontSize: "42px",
  fontWeight: "700",
  color: "#ef4444",
};

const numberCyan = {
  fontSize: "42px",
  fontWeight: "700",
  color: "#06b6d4",
};

/* TABLE */

const thStyle = {
  textAlign: "left",
  padding: "16px",
  color: "#94a3b8",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
};

const tdStyle = {
  padding: "18px 16px",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
};
