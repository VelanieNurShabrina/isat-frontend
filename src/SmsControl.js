import React, { useState } from "react";

export default function SmsControl({ apiBase }) {
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

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
      />

      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={sendSMS} disabled={loading}>
        {loading ? "Sending..." : "Send SMS"}
      </button>

      {response && <pre>{response}</pre>}
    </div>
  );
}
