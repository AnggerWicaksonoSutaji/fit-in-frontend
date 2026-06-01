import React, { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000/api/admin";

const OTOT_LIST = ["Dada", "Bahu", "Paha", "Lengan", "Punggung", "Perut", "Kaki"];

const ototColor = (otot) => {
  const map = {
    Dada: "#e03030", Bahu: "#cc44cc", Paha: "#1a6ebd",
    Lengan: "#06b6d4", Punggung: "#f59e0b", Perut: "#34d399", Kaki: "#fb923c",
  };
  return map[otot] || "#94a3b8";
};

const EMPTY_FORM = { nama_latihan: "", otot: "Dada", video_latihan: "" };

export default function WorkoutManagement() {
  return (
    <div style={{ padding: "30px" }}>
      <h1>KELOLA WORKOUT</h1>

      <button style={{
        padding: "10px 20px",
        marginTop: "20px"
      }}>
        Tambah Workout
      </button>
    </div>
  );
}