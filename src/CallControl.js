// src/CallControl.js
import React, { useState, useEffect } from "react";

export default function CallControl({ apiBase, isCalling, onCallStateChange }) {
  const [number, setNumber] = useState("+870772001899");
  const [callSeconds, setCallSeconds] = useState(15);
  const [statusMsg, setStatusMsg] = useState("");
  const [stopping, setStopping] = useState(false);

  // Restore saved values on page load
  useEffect(() => {
    const savedNumber = localStorage.getItem("call_number");
    const savedDuration = localStorage.getItem("call_duration");

    if (savedNumber) setNumber(savedNumber);
    if (savedDuration) setCallSeconds(parseInt(savedDuration));
  }, []);

  const handleCall = async () => {
    if (isCalling) return;

    onCallStateChange(true);
    setStatusMsg("📞 Calling number...");

    try {
      const res = await fetch(
        `${apiBase}/call?number=${encodeURIComponent(
          number
        )}&secs=${callSeconds}`
      );
      const data = await res.json();

      if (data.status === "ok") {
        setStatusMsg(`📞 Calling ${data.number} for ${data.call_seconds}s`);
      } else {
        setStatusMsg(`⚠️ Failed: ${data.msg || "Unknown error"}`);
        onCallStateChange(false);
      }
    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Unable to connect.");
      onCallStateChange(false);
    }
  };

  const handleStop = async () => {
    if (!isCalling) return;

    setStopping(true);
    setStatusMsg("🛑 Ending call...");

    try {
      const res = await fetch(`${apiBase}/call/stop`, { method: "POST" });
      await res.json();
      setStatusMsg("🛑 Call terminated");
    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Failed to stop call");
    } finally {
      setStopping(false);
      onCallStateChange(false);
    }
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h4>📞 Call Control</h4>

      {/* Number */}
      <div style={{ marginBottom: 10 }}>
        <label>Number:</label>
        <input
          type="text"
          value={number}
          onChange={(e) => {
            setNumber(e.target.value);
            localStorage.setItem("call_number", e.target.value);
          }}
          style={{
            marginLeft: 10,
            padding: 6,
            borderRadius: 6,
            border: "1px solid #ccc",
            width: 200,
          }}
        />
      </div>

      {/* Duration */}
      <div style={{ marginBottom: 10 }}>
        <label>Duration (s):</label>
        <input
          type="number"
          min="1"
          max="300"
          value={callSeconds}
          onChange={(e) => {
            setCallSeconds(e.target.value);
            localStorage.setItem("call_duration", e.target.value);
          }}
          style={{
            marginLeft: 10,
            padding: 6,
            borderRadius: 6,
            border: "1px solid #ccc",
            width: 80,
          }}
        />
      </div>

      {/* Buttons */}
      <button
        onClick={handleCall}
        disabled={isCalling}
        style={{
          padding: "6px 12px",
          marginRight: 10,
          borderRadius: 6,
          border: "none",
          backgroundColor: isCalling ? "#8bc48b" : "#28a745",
          color: "white",
        }}
      >
        {isCalling ? "Calling..." : "Call"}
      </button>

      <button
        onClick={handleStop}
        disabled={!isCalling || stopping}
        style={{
          padding: "6px 12px",
          borderRadius: 6,
          border: "none",
          backgroundColor: "#dc3545",
          color: "white",
        }}
      >
        Stop
      </button>

      {statusMsg && (
        <p style={{ marginTop: 10, fontSize: 14 }}>{statusMsg}</p>
      )}
    </div>
  );
}
