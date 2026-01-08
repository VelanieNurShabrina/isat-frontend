import React, { useState } from "react";

export default function AutoCallControl({ apiBase, autoCall, onChange }) {
  const [enabled, setEnabled] = useState(autoCall.enabled);

  const [interval, setInterval] = useState(String(autoCall.interval));
  const [lastValidInterval, setLastValidInterval] = useState(
    String(autoCall.interval)
  );

  const [number, setNumber] = useState(autoCall.number);

  const [duration, setDuration] = useState(String(autoCall.duration));
  const [lastValidDuration, setLastValidDuration] = useState(
    String(autoCall.duration)
  );

  // =========================
  // SAVE CONFIG
  // =========================
  const saveConfig = async (newEnabled, newInterval, newDuration) => {
    try {
      await fetch(`${apiBase}/config/auto-call`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          enabled: newEnabled,
          interval: newInterval,
          number,
          duration: newDuration,
        }),
      });

      onChange({
        enabled: newEnabled,
        interval: newInterval,
      });
    } catch {
      // dashboard monitoring → no noisy error
    }
  };

  // =========================
  // TOGGLE
  // =========================
  const toggleAutoCall = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);

    saveConfig(
      newEnabled,
      parseInt(lastValidInterval, 10),
      parseInt(lastValidDuration, 10)
    );
  };

  return (
    <div style={{ padding: "12px 16px" }}>
      {/* HEADER */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
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
      <label>
        <input type="checkbox" checked={enabled} onChange={toggleAutoCall} /> Enable
        Auto Call
      </label>

      {/* INTERVAL */}
      <div style={{ marginTop: 12 }}>
        <label>Interval (seconds)</label>
        <input
          type="text"
          disabled={enabled}
          value={interval}
          onChange={(e) => {
            if (/^\d*$/.test(e.target.value)) {
              setInterval(e.target.value);
            }
          }}
          onBlur={() => {
            const val = parseInt(interval, 10);
            if (!isNaN(val) && val >= 5 && val <= 600) {
              setLastValidInterval(interval);
              saveConfig(enabled, val, parseInt(lastValidDuration, 10));
            } else {
              setInterval(lastValidInterval);
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
          disabled={enabled}
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* DURATION */}
      <div style={{ marginTop: 12 }}>
        <label>Call Duration (seconds)</label>
        <input
          type="text"
          disabled={enabled}
          value={duration}
          onChange={(e) => {
            if (/^\d*$/.test(e.target.value)) {
              setDuration(e.target.value);
            }
          }}
          onBlur={() => {
            const val = parseInt(duration, 10);
            if (!isNaN(val) && val >= 5 && val <= 300) {
              setLastValidDuration(duration);
              saveConfig(enabled, parseInt(lastValidInterval, 10), val);
            } else {
              setDuration(lastValidDuration);
            }
          }}
          style={inputStyle}
        />
      </div>
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
