// src/CallControl.js
import React, { useState } from "react";

export default function CallControl({ apiBase, isCalling, onCallStateChange }) {
  const [number, setNumber] = useState("+870772001899");
  const [callSeconds, setCallSeconds] = useState(15);
  const [statusMsg, setStatusMsg] = useState("");
  const [stopping, setStopping] = useState(false);

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
        setStatusMsg(
          `📞 Calling ${data.number} for ${data.call_seconds} seconds`
        );
      } else {
        setStatusMsg(`⚠️ Failed to make call: ${data.msg || "Unknown"}`);
        onCallStateChange(false);
      }
    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Unable to connect (check tunnel).");
      onCallStateChange(false);
    }
  };

  const handleStop = async () => {
    if (!isCalling) return;

    setStopping(true);
    setStatusMsg("🛑 Ending call...");

    try {
      const res = await fetch(`${apiBase}/call/stop`, {
        method: "POST",
      });
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
    <div
      style={{
        marginBottom: 30,
        padding: "15px",
        border: "1px solid #ccc",
        borderRadius: 8,
        backgroundColor: "#fafafa",
        display: "inline-block",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <h4>📞 Call Control</h4>

      <div style={{ marginBottom: 10 }}>
        <label style={{ fontWeight: 500 }}>Number:</label>
        <input
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          style={{
            marginLeft: 10,
            padding: "5px",
            borderRadius: 6,
            border: "1px solid #ccc",
            width: "200px",
          }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ fontWeight: 500 }}>Duration (s):</label>
        <input
          type="number"
          min="1"
          max="300"
          value={callSeconds}
          onChange={(e) => setCallSeconds(e.target.value)}
          style={{
            marginLeft: 10,
            padding: "5px",
            borderRadius: 6,
            border: "1px solid #ccc",
            width: "80px",
          }}
        />
      </div>

      <button
        onClick={handleCall}
        disabled={isCalling} // disable saat call aktif
        style={{
          padding: "6px 12px",
          backgroundColor: isCalling ? "#8bc48b" : "#28a745",
          color: "white",
          border: "none",
          borderRadius: 6,
          marginRight: 10,
          cursor: isCalling ? "not-allowed" : "pointer",
        }}
      >
        {isCalling ? "Calling..." : "Call"}
      </button>

      <button
        onClick={handleStop}
        disabled={!isCalling || stopping}
        style={{
          padding: "6px 12px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: !isCalling || stopping ? "not-allowed" : "pointer",
        }}
      >
        Stop
      </button>

      {statusMsg && (
        <p style={{ marginTop: 10, fontSize: 14, color: "#333" }}>
          {statusMsg}
        </p>
      )}
    </div>
  );
}
