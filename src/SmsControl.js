import React, { useState } from "react";
import { generatePDU } from "./utils/pdu";

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
      // Generate PDU dari frontend
      const { pdu, length } = generatePDU(number, message);
      console.log("[DEBUG] PDU:", pdu, "LEN:", length);

      // Kirim ke backend
      const res = await fetch(`${apiBase}/sms/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdu, length }),
      });

      const data = await res.json();

      if (data.status === "ok") {
        setResponse("✅ SMS BERHASIL DIKIRIM!\n" + JSON.stringify(data, null, 2));
      } else {
        setResponse("❌ ERROR:\n" + JSON.stringify(data, null, 2));
      }
    } catch (err) {
      setResponse("❌ Exception: " + err.message);
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <h3 style={{ margin: 0 }}>📨 Kirim SMS</h3>

      <input
        placeholder="Nomor tujuan (contoh: +628xxxx)"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

      <textarea
        placeholder="Isi pesan"
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
        {loading ? "Mengirim..." : "Kirim SMS"}
      </button>

      {response && (
        <pre
          style={{
            background: "#f5f5f5",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            maxHeight: "250px",
            overflow: "auto",
          }}
        >
          {response}
        </pre>
      )}
    </div>
  );
}
