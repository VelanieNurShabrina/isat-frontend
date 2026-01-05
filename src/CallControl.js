// src/CallControl.js
import React, { useState, useEffect } from "react";

export default function CallControl({ apiBase, isCalling, onCallStateChange }) {
  const [number, setNumber] = useState("+870772001899");
  const [callSeconds, setCallSeconds] = useState(15);
  const [statusMsg, setStatusMsg] = useState("");
  const [stopping, setStopping] = useState(false);

  // restore last input
  useEffect(() => {
    const savedNumber = localStorage.getItem("call_number");
    const savedDuration = localStorage.getItem("call_duration");

    if (savedNumber) setNumber(savedNumber);
    if (savedDuration) setCallSeconds(parseInt(savedDuration));
  }, []);

  // 🔁 polling backend (SATU-SATUNYA sumber kebenaran)
  useEffect(() => {
    if (!isCalling) return;

    const poll = setInterval(async () => {
      try {
        const res = await fetch(`${apiBase}/status`, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });
        const data = await res.json();

        if (data.call_active === false) {
          onCallStateChange(false);
          setStatusMsg("🛑 Call ended");
          resetForm(); // ✅ SATU-SATUNYA TEMPAT RESET
        }
      } catch (e) {
        console.error("Polling failed", e);
      }
    }, 1000);

    return () => clearInterval(poll);
  }, [isCalling]);

  const resetForm = () => {
    setNumber("");
    setCallSeconds(15);
    localStorage.removeItem("call_number");
    localStorage.removeItem("call_duration");
  };

  const handleCall = async () => {
    if (isCalling) return;

    onCallStateChange(true);
    setStatusMsg("📞 Calling (waiting for connection)...");

    try {
      await fetch(
        `${apiBase}/call?number=${encodeURIComponent(number)}&secs=${callSeconds}`,
        { headers: { "ngrok-skip-browser-warning": "true" } }
      );
    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Failed to start call");
      onCallStateChange(false);
    }
  };

  const handleStop = async () => {
    if (!isCalling) return;

    setStopping(true);
    setStatusMsg("🛑 Stopping call...");

    try {
      await fetch(`${apiBase}/call/stop`, {
        method: "POST",
        headers: { "ngrok-skip-browser-warning": "true" },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setStopping(false);
      // ⛔ JANGAN reset, ⛔ JANGAN set call ended
      // tunggu polling backend
    }
  };

  return (
    <div style={{ padding: "12px 16px" }}>
      <h3>📞 Call Control</h3>

      <input
        value={number}
        onChange={(e) => {
          setNumber(e.target.value);
          localStorage.setItem("call_number", e.target.value);
        }}
      />

      <input
        type="number"
        value={callSeconds}
        onChange={(e) => {
          setCallSeconds(e.target.value);
          localStorage.setItem("call_duration", e.target.value);
        }}
      />

      <button onClick={handleCall} disabled={isCalling}>Call</button>
      <button onClick={handleStop} disabled={!isCalling || stopping}>Stop</button>

      {statusMsg && <div>{statusMsg}</div>}
    </div>
  );
}
