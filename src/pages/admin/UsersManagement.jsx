import React from "react";

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