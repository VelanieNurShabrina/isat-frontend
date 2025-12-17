import React, { useState } from "react";

export default function SmsControl({ apiBase }) {
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendSMS() {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/sms/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number, message }),
      });

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (e) {
      setResponse("Error: " + e.message);
    }
    setLoading(false);
  }

  return (
    <>
      <h3>📨 Send SMS</h3>

      <input
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        placeholder="+8707xxxx"
      />

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={sendSMS} disabled={loading}>
        {loading ? "Sending..." : "Send SMS"}
      </button>

      {response && <pre>{response}</pre>}
    </>
  );
}
