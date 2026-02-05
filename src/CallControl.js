// src/CallControl.js
import React, { useState, useEffect } from "react";

export default function CallControl({
  apiBase,
  isCalling,
  autoCallRunning,
  onCallStateChange,
}) {
  const [number, setNumber] = useState("");
  const [callSeconds, setCallSeconds] = useState("");
  const [statusMsg, setStatusMsg] = useState("Idle");
  const [stopping, setStopping] = useState(false);

  // =========================
  // POLL BACKEND STATUS
  // =========================
  useEffect(() => {
    const poll = setInterval(async () => {
      try {
        const res = await fetch(`${apiBase}/status`, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });

        const data = await res.json();

        // ===== SYNC CALL STATE =====
        if (data.call_active !== isCalling) {
          onCallStateChange(data.call_active);
        }

        // ===== RESTORE FORM IF CALLING =====
        if (data.call_active && data.last_manual_call) {
          setNumber(data.last_manual_call.number || "");
          setCallSeconds(data.last_manual_call.duration || "");

          setStatusMsg(
            `📞 Calling ${data.last_manual_call.number} (waiting for connection…)`
          );
          return;
        }

        // ===== HANDLE FINISHED CALL =====
        if (!data.call_active) {

          if (data.call_state === "timeout") {
            setStatusMsg("⏱️ Call timeout");
          }
          else if (data.call_state === "stopped_by_user") {
            setStatusMsg("🛑 Stopped by user");

            // balik idle setelah 2 detik
            setTimeout(() => {
              setStatusMsg("Idle");
            }, 2000);
          }
          else if (data.call_state === "rejected") {
            setStatusMsg("❌ Call rejected");

            setTimeout(() => {
              setStatusMsg("Idle");
            }, 2000);
          }
          else {
            setStatusMsg("Idle");
          }
        }

      } catch (err) {
        console.error("Failed to fetch call status", err);
      }
    }, 1000);

    return () => clearInterval(poll);
  }, [apiBase, isCalling, onCallStateChange]);

  // =========================
  // HELPERS
  // =========================
  const resetForm = () => {
    setNumber("");
    setCallSeconds("");
  };

  // =========================
  // CALL HANDLER
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
        `${apiBase}/call?number=${encodeURIComponent(number)}&secs=${callSeconds}`,
        { headers: { "ngrok-skip-browser-warning": "true" } }
      );
    } catch {
      setStatusMsg("❌ Unable to connect");
      onCallStateChange(false);
    }
  };

  // =========================
  // STOP HANDLER
  // =========================
  const handleStop = async () => {
    if (!isCalling) return;

    setStopping(true);
    setStatusMsg("🛑 Stopping call...");

    try {
      await fetch(`${apiBase}/call/stop`, {
        method: "POST",
        headers: { "ngrok-skip-browser-warning": "true" },
      });
    } finally {
      setStopping(false);
      onCallStateChange(false);
      resetForm();
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div style={{ padding: "12px 16px" }}>
      <h3 style={{ marginBottom: 16 }}>📞 Call Control</h3>

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

        {autoCallRunning && (
          <div style={warnStyle}>
            ⚠️ Manual call disabled while auto call is running
          </div>
        )}

        <div style={{ fontSize: 13, color: "#555" }}>
          {statusMsg}
        </div>
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

const warnStyle = {
  fontSize: 12,
  color: "#92400e",
  background: "#fef3c7",
  padding: "6px 10px",
  borderRadius: 6,
};
