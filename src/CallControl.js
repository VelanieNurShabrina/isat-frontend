import React, { useState } from "react";

export default function CallControl({ apiBase }) {
  const [number, setNumber] = useState("+870772001899");
  const [callSeconds, setCallSeconds] = useState(15);
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCall = async () => {
    setLoading(true);
    setStatusMsg("📞 Memanggil nomor...");

    try {
      const res = await fetch(
        `${apiBase}/call?number=${encodeURIComponent(number)}&secs=${callSeconds}`
      );
      const data = await res.json();

      if (data.status === "ok") {
        setStatusMsg(`✅ Memanggil ${data.number} selama ${data.call_seconds} detik`);
      } else {
        setStatusMsg(`⚠️ Gagal melakukan panggilan: ${data.msg || "Tidak diketahui"}`);
      }
    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Tidak dapat terhubung ke Raspberry Pi (cek tunnel).");
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    setStatusMsg("🛑 Mengakhiri panggilan...");

    try {
      const res = await fetch(`${apiBase}/call?number=${encodeURIComponent(number)}&secs=0`);
      const data = await res.json();
      setStatusMsg("✅ Panggilan dihentikan.");
    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Gagal mengirim perintah stop call.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
       marginBottom: 30,
        padding: "15px",
        border: "1px solid #ccc",
        borderRadius: 8,
        backgroundColor: "#fafafa",
        display: "inline-block",
      }}
    >
      <h4>📞 Call Control</h4>
      <div style={{ marginBottom: 10 }}>
        <label style={{ fontWeight: 500 }}>Nomor:</label>
        <input
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          style={{
            marginLeft: 10,
            padding: "5px",
            borderRadius: 6,
            border: "1px solid #ccc",
            width: "200px",
          }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ fontWeight: 500 }}>Durasi (detik):</label>
        <input
          type="number"
          min="1"
          max="300"
          value={callSeconds}
          onChange={(e) => setCallSeconds(e.target.value)}
          style={{
            marginLeft: 10,
            padding: "5px",
            borderRadius: 6,
            border: "1px solid #ccc",
            width: "80px",
          }}
        />
      </div>

      <button
        onClick={handleCall}
        disabled={loading}
        style={{
          padding: "6px 12px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: 6,
          marginRight: 10,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        Call
      </button>

      <button
        onClick={handleStop}
        disabled={loading}
        style={{
          padding: "6px 12px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        Stop
      </button>

      {statusMsg && (
        <p style={{ marginTop: 10, fontSize: 14, color: "#333" }}>{statusMsg}</p>
      )}
    </div>
  );
}
