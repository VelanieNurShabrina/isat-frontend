import React, { useState } from "react";

export default function SmsControl({ apiBase }) {
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendSMS() {
    if (!number || !message) {
      setResponse("❌ Nomor dan pesan wajib diisi");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch(`${apiBase}/sms/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number,
          message,
        }),
      });

      const data = await res.json();

      if (data.status === "ok") {
        setResponse(
          `✅ SMS berhasil dikirim\n` +
          `📱 Tujuan : ${data.number}\n` +
          `💬 Pesan  : ${data.message}\n` +
          `⏱️ Waktu  : ${data.timestamp}`
        );
      } else {
        setResponse("❌ Gagal mengirim SMS");
      }
    } catch (err) {
      setResponse("❌ Error: " + err.message);
    }

    setLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <h3 style={{ margin: 0 }}>📨 Send SMS</h3>

      <input
        placeholder="Destination number (example: +628xxxx)"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

      <textarea
        placeholder="Message content"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          resize: "vertical",
        }}
      />

      <button
        onClick={sendSMS}
        disabled={loading}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "none",
          background: loading ? "#999" : "#007bff",
          color: "#fff",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Sending..." : "Send SMS"}
      </button>

      {response && (
        <pre
          style={{
            background: "#f5f5f5",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            whiteSpace: "pre-wrap",
          }}
        >
          {response}
        </pre>
      )}
    </div>
  );
}
