import React, { useState } from "react";

export default function AutoCallControl({ apiBase, autoCall, onChange }) {
  const [interval, setInterval] = useState(autoCall.interval);
  const [enabled, setEnabled] = useState(autoCall.enabled);
  const [number, setNumber] = useState(autoCall.number);
  const [duration, setDuration] = useState(autoCall.duration);

  const [statusMsg, setStatusMsg] = useState("");

  const saveConfig = async (newEnabled, newInterval) => {
    try {
      setStatusMsg("⏳ Updating auto call config...");

      const res = await fetch(`${apiBase}/config/auto-call`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          enabled: newEnabled,
          interval: newInterval,
          number,
          duration,
        }),
      });

      const json = await res.json();

      if (json.status === "ok") {
        onChange({
          enabled: json.enabled,
          interval: json.interval,
        });
        setStatusMsg("✅ Auto call updated");
      } else {
        setStatusMsg("⚠️ Failed to update auto call");
      }
    } catch (err) {
      setStatusMsg("❌ Cannot connect to backend");
    }
  };

  const toggleAutoCall = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    saveConfig(newEnabled, interval);
  };

  const changeInterval = (e) => {
    const val = parseInt(e.target.value, 10);
    if (Number.isNaN(val)) return;
    setInterval(val);
    saveConfig(enabled, val);
  };

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
          🔁 Auto Call
        </h3>

        <div
          style={{
            width: 48,
            height: 3,
            background: "#2563eb", // biru = automated/system
            borderRadius: 2,
            marginTop: 6,
          }}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <label>
          <input type="checkbox" checked={enabled} onChange={toggleAutoCall} />{" "}
          Enable Auto Call
        </label>
        {enabled && (
          <div style={{ marginTop: 6, fontSize: 12, color: "#16a34a" }}>
            🟢 Auto Call is running
          </div>
        )}
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Interval (seconds)</label>
        <input
          type="number"
          min="5"
          max="600"
          value={interval}
          disabled={enabled}
          onChange={changeInterval}
          style={{
            width: "100%",
            padding: "8px",
            marginTop: 4,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Destination Number</label>
        <input
          type="text"
          value={number}
          disabled={enabled}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="+8707xxxxxxx"
          style={inputStyle}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Call Duration (seconds)</label>
        <input
          type="number"
          min="5"
          max="300"
          value={duration}
          disabled={enabled}
          onChange={(e) => setDuration(parseInt(e.target.value, 10))}
          style={inputStyle}
        />
      </div>

      {statusMsg && (
        <div
          style={{
            marginTop: 10,
            fontSize: 13,
            color: statusMsg.startsWith("✅")
              ? "#15803d"
              : statusMsg.startsWith("⚠️")
              ? "#b45309"
              : "#b91c1c",
          }}
        >
          {statusMsg}
        </div>
      )}
    </div>
  );
}
const inputStyle = {
  width: "100%",
  padding: "8px",
  marginTop: 4,
  borderRadius: 6,
  border: "1px solid #ccc",
};
