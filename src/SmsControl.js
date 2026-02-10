import React, { useState, useEffect } from "react";

export default function SmsControl({ apiBase }) {
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const [autoSmsRunning, setAutoSmsRunning] = useState(false);
  const [manualSmsProcessing, setManualSmsProcessing] = useState(false);

  // 🔥 Poll backend status
  // 🔥 Poll backend status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${apiBase}/status`, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });

        const json = await res.json();

        setAutoSmsRunning(json.auto_sms?.enabled);

        // ✅ FIX: cek source juga
        setManualSmsProcessing(
          json.current_task?.type === "SMS" &&
            json.current_task?.source === "manual",
        );
      } catch {}
    };

    fetchStatus();
    const t = setInterval(fetchStatus, 1000);
    return () => clearInterval(t);
  }, [apiBase]);

  async function sendSMS() {
    if (!number || !message) {
      setResponse("❌ Number and message required");
      return;
    }

    if (!number.startsWith("+")) {
      setResponse("❌ Number must start with +");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch(`${apiBase}/sms/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ number, message }),
      });

      const data = await res.json();

      if (data.status === "ok") {
        setResponse("✅ SMS queued");
      } else {
        setResponse("❌ Failed to queue SMS");
      }
    } catch (err) {
      setResponse("❌ Error: " + err.message);
    }

    setLoading(false);
  }

  const disabled = loading || autoSmsRunning || manualSmsProcessing;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Baris Pertama: Nomor & Button */}
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          style={{ flex: 2 }} // Input nomor lebih lebar
          placeholder="Phone Number (+62...)"
          value={number}
          disabled={disabled}
          onChange={(e) => setNumber(e.target.value)}
        />
        <button
          onClick={sendSMS}
          disabled={disabled}
          style={{
            flex: 1,
            background: disabled ? "#cbd5e1" : "#2563eb",
            color: "white",
            border: "none",
            fontSize: "13px",
          }}
        >
          {loading ? "Sending..." : "🚀 Send SMS"}
        </button>
      </div>

      {/* Baris Kedua: Pesan */}
      <textarea
        placeholder="Type message here..."
        value={message}
        disabled={disabled}
        onChange={(e) => setMessage(e.target.value)}
        style={{ minHeight: "80px", resize: "none", padding: "10px" }}
      />

      {/* Baris Ketiga: Status/Warning (Kecil & Rapih) */}
      {(autoSmsRunning || manualSmsProcessing) && (
        <div
          style={{
            background: autoSmsRunning ? "#fffbeb" : "#eff6ff",
            padding: "8px",
            borderRadius: "6px",
            fontSize: "11px",
            color: autoSmsRunning ? "#92400e" : "#1e40af",
            border: `1px solid ${autoSmsRunning ? "#fef3c7" : "#dbeafe"}`,
          }}
        >
          {autoSmsRunning
            ? "⚠️ Auto SMS Mode Active"
            : "⏳ System is processing manual SMS..."}
        </div>
      )}

      {response && (
        <pre style={{ fontSize: "11px", margin: 0, color: "#64748b" }}>
          {response}
        </pre>
      )}
    </div>
  );
}
