import React, { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000/api/admin";

const roleColor = (role) => {
  if (role === "admin") return { bg: "rgba(224,48,48,0.15)", text: "#e03030", border: "rgba(224,48,48,0.3)" };
  if (role === "premium") return { bg: "rgba(6,182,212,0.15)", text: "#06b6d4", border: "rgba(6,182,212,0.3)" };
  return { bg: "rgba(71,85,105,0.3)", text: "#94a3b8", border: "rgba(71,85,105,0.4)" };
};

export default function UsersManagement() {
  return (
    <div style={{ padding: "30px" }}>
      <h1>KELOLA USER</h1>

      <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>1</td>
            <td>Admin</td>
            <td>admin@gmail.com</td>
            <td>admin</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}