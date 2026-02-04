import React, { useState, useEffect } from "react";

export default function SmsControl({ apiBase, autoSmsRunning }) {
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Auto reset kalau Auto SMS nyala
  useEffect(() => {
    if (autoSmsRunning) {
      setNumber("");
      setMessage("");
      setResponse("");
    }
  }, [autoSmsRunning]);

  async function sendSMS() {
    if (!number || !message) {
      setResponse("❌ Number and message are required.");
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
        setResponse(
          `✅ SMS queued successfully\n` +
          `📱 Destination : ${number}\n` +
          `💬 Message : ${message}\n` +
          `⏱️ Time : ${new Date().toLocaleTimeString()}`
        );
      } else {
        setResponse("❌ Failed to queue SMS");
      }
    } catch (err) {
      setResponse("❌ Error: " + err.message);
    }

    setLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <h3>📨 Send SMS</h3>

      <input
        placeholder="+628xxxx"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        disabled={autoSmsRunning}
      />

      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={autoSmsRunning}
      />

      <button
        onClick={sendSMS}
        disabled={loading || autoSmsRunning}
      >
        {loading ? "Sending..." : "Send SMS"}
      </button>

      {/* ✅ Warning kalau Auto SMS aktif */}
      {autoSmsRunning && (
        <div
          style={{
            fontSize: 12,
            color: "#92400e",
            background: "#fef3c7",
            padding: "6px 10px",
            borderRadius: 6,
          }}
        >
          ⚠️ Manual SMS disabled while Auto SMS is running
        </div>
      )}

      {response && <pre>{response}</pre>}
    </div>
  );
}
