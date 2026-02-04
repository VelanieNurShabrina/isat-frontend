import React, { useState, useEffect } from "react";

export default function SmsControl({ apiBase }) {
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const [autoSmsRunning, setAutoSmsRunning] = useState(false);
  const [manualSmsProcessing, setManualSmsProcessing] = useState(false);

  // 🔥 Poll backend status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${apiBase}/status`, {
          headers: { "ngrok-skip-browser-warning": "true" }
        });

        const json = await res.json();

        setAutoSmsRunning(json.auto_sms?.enabled);

        setManualSmsProcessing(
          json.current_task?.type === "SMS"
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

  const disabled =
    loading ||
    autoSmsRunning ||
    manualSmsProcessing;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <h3>📨 Send SMS</h3>

      <input
        placeholder="+628xxxx"
        value={number}
        disabled={disabled}
        onChange={(e) => setNumber(e.target.value)}
      />

      <textarea
        placeholder="Message"
        value={message}
        disabled={disabled}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={sendSMS} disabled={disabled}>
        {loading ? "Sending..." : "Send SMS"}
      </button>

      {/* WARNINGS */}
      {autoSmsRunning && (
        <div style={{
          background: "#fef3c7",
          padding: 8,
          borderRadius: 6,
          fontSize: 12
        }}>
          ⚠️ Manual SMS disabled while Auto SMS is running
        </div>
      )}

      {manualSmsProcessing && (
        <div style={{
          background: "#dbeafe",
          padding: 8,
          borderRadius: 6,
          fontSize: 12
        }}>
          ⏳ Manual SMS processing...
        </div>
      )}

      {response && <pre>{response}</pre>}
    </div>
  );
}
