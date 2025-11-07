import React, { useState } from "react";

export default function IntervalControl({ apiBase, onIntervalChange }) {
  const [interval, setIntervalValue] = useState(10);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleChange = async (e) => {
    const newInterval = parseInt(e.target.value);

    // 🚫 Cegah ubah interval jika masih pakai Railway (bukan Pi)
    if (apiBase.includes("railway")) {
      setStatusMsg(
        "⚠️ Tidak bisa ubah interval di mode Cloud (Railway). Jalankan di Raspberry Pi untuk mengatur polling."
      );
      alert(
        "⚠️ Interval tidak bisa diubah di mode Cloud (Railway). Jalankan di Raspberry Pi untuk mengatur polling."
      );
      return;
    }

    setIntervalValue(newInterval);
    setLoading(true);
    setStatusMsg("⏳ Mengubah interval...");

    try {
      // ✅ Endpoint Flask: /config/interval?interval=xx
      const res = await fetch(`${apiBase}/config/interval?interval=${newInterval}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const text = await res.text();
      let json;

      try {
        json = JSON.parse(text);
      } catch {
        console.error("⚠️ Response bukan JSON:", text);
        setStatusMsg("⚠️ Server tidak mengembalikan format JSON yang valid");
        return;
      }

      if (json.status === "ok") {
        setStatusMsg(`✅ Interval berhasil diubah menjadi ${newInterval} detik`);
        if (onIntervalChange) onIntervalChange(newInterval);
        console.log(`✅ Interval berhasil diubah ke ${newInterval} detik`);
      } else {
        setStatusMsg(
          `⚠️ Gagal ubah interval: ${json.msg || json.message || "Tidak diketahui"}`
        );
      }
    } catch (err) {
      console.error("❌ Gagal koneksi ke Raspberry:", err);
      setStatusMsg("❌ Tidak bisa terhubung ke Raspberry (cek tunnel Cloudflare).");
      alert("❌ Gagal terhubung ke Raspberry. Pastikan tunnel Cloudflare aktif.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "12px 16px",
        borderRadius: 8,
        border: "1px solid #ddd",
        display: "block",
        width: "100%",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <label style={{ fontWeight: "600", marginBottom: 6, display: "block" }}>
        ⏱️ Signal Reading Interval:
      </label>

      <select
        value={interval}
        onChange={handleChange}
        disabled={loading}
        style={{
          padding: "6px 10px",
          borderRadius: 6,
          border: "1px solid #ccc",
          fontSize: 14,
          cursor: loading ? "not-allowed" : "pointer",
          width: "100%",
          maxWidth: 180,
        }}
      >
        <option value="5">5 Seconds</option>
        <option value="10">10 Seconds</option>
        <option value="20">20 Seconds</option>
        <option value="30">30 Seconds</option>
        <option value="60">60 Seconds</option>
      </select>

      {statusMsg && (
        <p
          style={{
            fontSize: 13,
            marginTop: 10,
            lineHeight: 1.3,
            color: statusMsg.startsWith("✅")
              ? "green"
              : statusMsg.startsWith("⚠️")
              ? "#d67b00"
              : statusMsg.startsWith("❌")
              ? "red"
              : "#333",
            wordWrap: "break-word",
            whiteSpace: "normal",
          }}
        >
          {statusMsg}
        </p>
      )}
    </div>
  );
}
