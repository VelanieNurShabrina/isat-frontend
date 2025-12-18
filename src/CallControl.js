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
    <>
      {/* TITLE */}
      <h4
        style={{
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        📞 Call Control
      </h4>

      {/* NUMBER INPUT */}
      <div style={{ marginBottom: 10 }}>
        <label style={{ fontSize: 12, color: "#555" }}>Number</label>
        <input
          type="text"
          value={number}
          onChange={(e) => {
            setNumber(e.target.value);
            localStorage.setItem("call_number", e.target.value);
          }}
          style={{
            width: "100%",
            marginTop: 4,
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid #ddd",
            fontSize: 13,
          }}
        />
      </div>

      {/* DURATION INPUT */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 12, color: "#555" }}>
          Duration (seconds)
        </label>
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
            width: "100%",
            marginTop: 4,
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid #ddd",
            fontSize: 13,
          }}
        />
      </div>

      {/* BUTTONS */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={handleCall}
          disabled={isCalling}
          style={{
            flex: 1,
            padding: "8px 0",
            borderRadius: 8,
            border: "none",
            background: isCalling ? "#86efac" : "#16a34a",
            color: "#fff",
            fontWeight: 600,
            cursor: isCalling ? "not-allowed" : "pointer",
          }}
        >
          {isCalling ? "Calling..." : "Call"}
        </button>

        <button
          onClick={handleStop}
          disabled={!isCalling || stopping}
          style={{
            flex: 1,
            padding: "8px 0",
            borderRadius: 8,
            border: "none",
            background: "#dc2626",
            color: "#fff",
            fontWeight: 600,
            cursor: !isCalling ? "not-allowed" : "pointer",
          }}
        >
          Stop
        </button>
      </div>

      {/* STATUS */}
      {statusMsg && (
        <div
          style={{
            marginTop: 10,
            fontSize: 12,
            color: "#555",
          }}
        >
          {statusMsg}
        </div>
      )}
    </>
  );
}
