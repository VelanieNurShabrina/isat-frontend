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
    <div>
      {/* HEADER — SAMA PERSIS KAYA REALTIME SIGNAL */}
      <div style={{ marginBottom: 16 }}>
        <h3
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#111",
          }}
        >
          📞 Call Control
        </h3>

        <div
          style={{
            width: 48,
            height: 3,
            background: "#dc2626",
            borderRadius: 2,
            marginTop: 6,
          }}
        />
      </div>

      {/* FORM */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* NUMBER */}
        <div>
          <label style={{ fontSize: 13, color: "#555" }}>Number</label>
          <input
            type="text"
            value={number}
            onChange={(e) => {
              setNumber(e.target.value);
              localStorage.setItem("call_number", e.target.value);
            }}
            style={{
              width: "100%",
              marginTop: 6,
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
              fontSize: 14,
            }}
          />
        </div>

        {/* DURATION */}
        <div>
          <label style={{ fontSize: 13, color: "#555" }}>
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
              marginTop: 6,
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
              fontSize: 14,
            }}
          />
        </div>

        {/* BUTTONS */}
        <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
          <button
            onClick={handleCall}
            disabled={isCalling}
            style={{
              flex: 1,
              padding: "10px 0",
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
              padding: "10px 0",
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
          <div style={{ fontSize: 13, color: "#555" }}>{statusMsg}</div>
        )}
      </div>
    </div>
  );
}
