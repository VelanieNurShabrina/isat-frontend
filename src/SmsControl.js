import React, { useState, useEffect } from "react";
import { useRef } from "react";

export default function SmsControl({ apiBase }) {
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const [autoSmsRunning, setAutoSmsRunning] = useState(false);
  const [manualSmsProcessing, setManualSmsProcessing] = useState(false);

  // ==============================
  // POLL BACKEND STATUS
  // ==============================
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${apiBase}/status`, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });

        const json = await res.json();

        setAutoSmsRunning(json.auto_sms?.enabled);

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

  // ==============================
  // DETECT SUCCESS (FIXED)
  // ==============================
  const prevProcessing = useRef(false);

  useEffect(() => {
    // kalau sebelumnya lagi proses,
    // sekarang sudah tidak ➜ berarti selesai
    if (prevProcessing.current && !manualSmsProcessing) {
      setResponse("✅ SMS sent successfully");
    }

    prevProcessing.current = manualSmsProcessing;
  }, [manualSmsProcessing]);

  // ==============================
  // AUTO CLEAR SUCCESS MESSAGE
  // ==============================
  useEffect(() => {
    if (response.includes("success")) {
      const t = setTimeout(() => setResponse(""), 4000);
      return () => clearTimeout(t);
    }
  }, [response]);

  // ==============================
  // SEND SMS
  // ==============================
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

      if (data.status !== "ok") {
        setResponse("❌ Failed to send SMS");
      }
    } catch (err) {
      setResponse("❌ Error: " + err.message);
    }

    setLoading(false);
  }

  const disabled = loading || autoSmsRunning || manualSmsProcessing;

  // ==============================
  // UI
  // ==============================
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* NUMBER + BUTTON */}
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          style={{ flex: 2 }}
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
          {manualSmsProcessing ? "Sending..." : "🚀 Send SMS"}
        </button>
      </div>

      {/* MESSAGE */}
      <textarea
        placeholder="Type message here..."
        value={message}
        disabled={disabled}
        onChange={(e) => setMessage(e.target.value)}
        style={{ minHeight: "80px", resize: "none", padding: "10px" }}
      />

      {/* STATUS */}
      {manualSmsProcessing && (
        <div
          style={{
            fontSize: "11px",
            color: "#1e40af",
            background: "#eff6ff",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #dbeafe",
          }}
        >
          ⏳ Sending SMS...
        </div>
      )}

      {!manualSmsProcessing && response && (
        <div
          style={{
            fontSize: "11px",
            color: response.includes("❌") ? "#dc2626" : "#16a34a",
          }}
        >
          {response}
        </div>
      )}

      {/* AUTO SMS WARNING */}
      {autoSmsRunning && (
        <div
          style={{
            background: "#fffbeb",
            padding: "8px",
            borderRadius: "6px",
            fontSize: "11px",
            color: "#92400e",
            border: "1px solid #fef3c7",
          }}
        >
          ⚠️ Auto SMS Mode Active
        </div>
      )}
    </div>
  );
}
