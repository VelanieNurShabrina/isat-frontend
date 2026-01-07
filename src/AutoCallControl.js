import React, { useState } from "react";

export default function AutoCallControl({ apiBase, autoCall, onChange }) {
  const [interval, setInterval] = useState(String(autoCall.interval));
  const [enabled, setEnabled] = useState(autoCall.enabled);
  const [number, setNumber] = useState(autoCall.number);
  const [duration, setDuration] = useState(autoCall.duration);

  const [statusMsg, setStatusMsg] = useState("");

  // =========================
  // SAVE CONFIG (POST)
  // =========================
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
    } catch {
      // ❌ jangan spam error merah
      setStatusMsg("");
    }
  };

  // =========================
  // TOGGLE AUTO CALL
  // =========================
  const toggleAutoCall = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);

    const intervalNum = parseInt(interval, 10);
    if (!isNaN(intervalNum)) {
      saveConfig(newEnabled, intervalNum);
    }
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
            background: "#2563eb",
            borderRadius: 2,
            marginTop: 6,
          }}
        />
      </div>

      {/* ENABLE */}
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

      {/* INTERVAL */}
      <div style={{ marginTop: 12 }}>
        <label>Interval (seconds)</label>
        <input
          type="text"
          value={interval}
          disabled={enabled}
          onChange={(e) => {
            // hanya boleh angka
            if (/^\d*$/.test(e.target.value)) {
              setInterval(e.target.value);
            }
          }}
          onBlur={() => {
            const val = parseInt(interval, 10);
            if (!isNaN(val) && val >= 5 && val <= 600) {
              saveConfig(enabled, val);
            } else {
              // rollback kalau invalid
              setInterval(String(autoCall.interval));
            }
          }}
          style={inputStyle}
        />
      </div>

      {/* NUMBER */}
      <div style={{ marginTop: 12 }}>
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

      {/* DURATION */}
      <div style={{ marginTop: 12 }}>
        <label>Call Duration (seconds)</label>
        <input
          type="text"
          value={duration}
          disabled={enabled}
          onChange={(e) => {
            if (/^\d*$/.test(e.target.value)) {
              setDuration(e.target.value);
            }
          }}
          onBlur={() => {
            const val = parseInt(duration, 10);
            if (isNaN(val) || val < 5 || val > 300) {
              setDuration(autoCall.duration);
            }
          }}
          style={inputStyle}
        />
      </div>

      {/* STATUS */}
      {statusMsg && (
        <div
          style={{
            marginTop: 12,
            fontSize: 13,
            color: statusMsg.startsWith("✅")
              ? "#15803d"
              : statusMsg.startsWith("⚠️")
              ? "#b45309"
              : "#555",
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
