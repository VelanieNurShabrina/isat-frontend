import React, { useState } from "react";

export default function IntervalControl({ apiBase, onIntervalChange }) {
  const [interval, setIntervalValue] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const newInterval = parseInt(e.target.value);

    // 🚫 Jangan kirim request ke Railway
    if (apiBase.includes("railway")) {
      alert("⚠️ Interval tidak bisa diubah di mode Cloud (Railway). Jalankan di Raspberry Pi untuk mengatur polling.");
      return;
    }

    setIntervalValue(newInterval);
    setLoading(true);

    try {
      const res = await fetch(`${apiBase}/config/interval?interval=${newInterval}`);
      const text = await res.text();

      let json;
      try {
        json = JSON.parse(text);
      } catch {
        console.error("Response bukan JSON:", text);
        alert("Server tidak mengembalikan JSON valid");
        return;
      }

      if (json.status === "ok") {
        alert(`✅ Interval berhasil diubah menjadi ${newInterval} detik`);
        if (onIntervalChange) onIntervalChange(newInterval);
        console.log(`✅ Interval berhasil diubah ke ${newInterval} detik`);
      } else {
        alert("⚠️ Gagal ubah interval: " + (json.message || "Tidak diketahui"));
      }
    } catch (err) {
      console.error("❌ Gagal koneksi ke server:", err);
      alert("Terjadi kesalahan koneksi ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        marginBottom: 20,
        backgroundColor: "#f9f9f9",
        padding: "10px 15px",
        borderRadius: 8,
        border: "1px solid #ddd",
        display: "inline-block",
      }}
    >
      <label style={{ fontWeight: "600", marginRight: 10 }}>
        Signal Reading Interval:
      </label>
      <select
        value={interval}
        onChange={handleChange}
        disabled={loading}
        style={{
          padding: "5px 10px",
          borderRadius: 6,
          border: "1px solid #ccc",
          fontSize: 14,
          minWidth: "100px",
        }}
      >
        <option value="5">5 Seconds</option>
        <option value="10">10 Seconds</option>
        <option value="20">20 Seconds</option>
        <option value="30">30 Seconds</option>
        <option value="60">60 Seconds</option>
      </select>
    </div>
  );
}
