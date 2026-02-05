// src/CallControl.js
import React, { useState, useEffect, useRef } from "react";

export default function CallControl({
  apiBase,
  isCalling,
  autoCallRunning,
  onCallStateChange,
}) {
  const [number, setNumber] = useState("");
  const [callSeconds, setCallSeconds] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [stopping, setStopping] = useState(false);

  const wasCallingRef = useRef(false);

  // =========================
  const resetForm = () => {
    setNumber("");
    setCallSeconds("");
  };

  // =========================
  // Poll backend
  // =========================
  useEffect(() => {
    const poll = setInterval(async () => {
      try {
        const res = await fetch(`${apiBase}/status`, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });

        const data = await res.json();

        const isManualCall =
          data.call_active &&
          data.current_task?.type === "CALL" &&
          data.current_task?.source === "manual";

        onCallStateChange(isManualCall);

        // =========================
        // RESTORE FORM SAAT CALLING
        // =========================
        if (isManualCall) {
          wasCallingRef.current = true;

          setNumber(data.last_manual_call?.number || "");
          setCallSeconds(data.last_manual_call?.duration || "");

          setStatusMsg(
            `📞 Calling ${data.last_manual_call?.number || ""} (waiting for connection…)`,
          );
          return;
        }

        // =========================
        // CALL BARU SAJA SELESAI
        // =========================
        if (!data.call_active && wasCallingRef.current) {
          wasCallingRef.current = false;

          resetForm();

          if (data.call_state === "timeout") {
            setStatusMsg("⏱️ Call timeout");
          } else if (data.call_state === "stopped_by_user") {
            setStatusMsg("🛑 Stopped by user");
          } else if (data.call_state === "rejected") {
            setStatusMsg("❌ Call rejected");
          } else {
            setStatusMsg("Idle");
          }
        }
      } catch {}
    }, 1000);

    return () => clearInterval(poll);
  }, [apiBase]);

  // =========================
  const handleCall = async () => {
    if (autoCallRunning) return;

    if (!number || !callSeconds) {
      setStatusMsg("⚠️ Number & duration required");
      return;
    }

    setStatusMsg(`📞 Calling ${number}...`);

    await fetch(
      `${apiBase}/call?number=${encodeURIComponent(number)}&secs=${callSeconds}`,
      { headers: { "ngrok-skip-browser-warning": "true" } },
    );
  };

  const handleStop = async () => {
    if (!isCalling) return;

    setStopping(true);

    await fetch(`${apiBase}/call/stop`, {
      method: "POST",
      headers: { "ngrok-skip-browser-warning": "true" },
    });

    setStopping(false);
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
