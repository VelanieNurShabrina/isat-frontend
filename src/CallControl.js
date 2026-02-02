// src/CallControl.js
import React, { useState, useEffect } from "react";

export default function CallControl({
  apiBase,
  isCalling,
  autoCallRunning, // ⬅️ BARU
  onCallStateChange,
}) {
  const [number, setNumber] = useState("");
  const [callSeconds, setCallSeconds] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [stopping, setStopping] = useState(false);

  // =========================
  // Poll backend status
  // =========================
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
          resetForm();
        }
      } catch (err) {
        console.error("Failed to fetch call status", err);
      }
    }, 1000);

    return () => clearInterval(poll);
  }, [isCalling, apiBase, onCallStateChange]);

  // =========================
  // Helpers
  // =========================
  const resetForm = () => {
    setNumber("");
    setCallSeconds("");
  };

  // =========================
  // Handlers
  // =========================
  const handleCall = async () => {
    if (autoCallRunning) return;

    if (!number || !callSeconds) {
      setStatusMsg("⚠️ Number & duration required");
      return;
    }

    onCallStateChange(true);
    setStatusMsg(`📞 Calling ${number} (waiting for connection…)`);

    try {
      await fetch(
        `${apiBase}/call?number=${encodeURIComponent(
          number
        )}&secs=${callSeconds}`,
        {
          headers: { "ngrok-skip-browser-warning": "true" },
        }
      );
    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Unable to connect");
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
      onCallStateChange(false);
      setStatusMsg("🛑 Call stopped by user");
      resetForm();
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div style={{ padding: "12px 16px" }}>
      {/* HEADER */}
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
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          placeholder="Destination number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          disabled={isCalling || autoCallRunning}
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="Duration (seconds)"
          min="1"
          max="300"
          value={callSeconds}
          onChange={(e) => setCallSeconds(e.target.value)}
          disabled={isCalling || autoCallRunning}
          style={inputStyle}
        />

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleCall}
            disabled={isCalling || autoCallRunning}
            style={{
              ...btnStyle,
              background: autoCallRunning ? "#9ca3af" : "#16a34a",
              cursor: autoCallRunning ? "not-allowed" : "pointer",
            }}
          >
            Call
          </button>

          <button
            onClick={handleStop}
            disabled={!isCalling || stopping}
            style={{ ...btnStyle, background: "#dc2626" }}
          >
            Stop
          </button>
        </div>

        {/* INFO AUTO CALL */}
        {autoCallRunning && (
          <div
            style={{
              fontSize: 12,
              color: "#92400e",
              background: "#fef3c7",
              padding: "6px 10px",
              borderRadius: 6,
            }}
          >
            ⚠️ Manual call disabled while auto call is running
          </div>
        )}

        {statusMsg && (
          <div style={{ fontSize: 13, color: "#555" }}>{statusMsg}</div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #ccc",
};

const btnStyle = {
  flex: 1,
  padding: "8px 0",
  borderRadius: 8,
  border: "none",
  color: "white",
  fontWeight: 600,
};
