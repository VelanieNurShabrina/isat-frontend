// src/AutoCallControl.js
import React, { useState, useEffect } from "react";

export default function AutoCallControl({ apiBase, autoCall, onChange }) {
  // =========================
  // STATE (DISPLAY ONLY)
  // =========================
  const enabled = autoCall.enabled;

  const [interval, setInterval] = useState(String(autoCall.interval));
  const [lastValidInterval, setLastValidInterval] = useState(
    String(autoCall.interval)
  );

  const [number, setNumber] = useState(autoCall.number || "");

  const [duration, setDuration] = useState(String(autoCall.duration));
  const [lastValidDuration, setLastValidDuration] = useState(
    String(autoCall.duration)
  );

  // =========================
  // SYNC DARI BACKEND (PENTING)
  // =========================
  useEffect(() => {
    setInterval(String(autoCall.interval));
    setLastValidInterval(String(autoCall.interval));

    setDuration(String(autoCall.duration));
    setLastValidDuration(String(autoCall.duration));

    setNumber(autoCall.number || "");
  }, [autoCall]);

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
        number,
        duration: newDuration,
      });
    } catch {
      // dashboard monitoring → no error popup
    }
  };

  // =========================
  // TOGGLE AUTO CALL
  // =========================
  const toggleAutoCall = () => {
    saveConfig(
      !enabled,
      parseInt(lastValidInterval, 10),
      parseInt(lastValidDuration, 10)
    );
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
      <div>
        <label>
          <input type="checkbox" checked={enabled} onChange={toggleAutoCall} />{" "}
          Enable Auto Call
        </label>

        {enabled && (
          <div
            style={{
              marginTop: 8,
              padding: "6px 10px",
              borderRadius: 6,
              background: "#dcfce7",
              color: "#166534",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            🟢 Auto Call is running
          </div>
        )}
      </div>

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
            if (interval === "") {
              setInterval(lastValidInterval);
              return;
            }

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

      {/* DESTINATION NUMBER */}
      <div style={{ marginTop: 12 }}>
        <label>Destination Number</label>
        <input
          type="text"
          disabled={enabled}
          value={number}
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
          disabled={enabled}
          value={duration}
          onChange={(e) => {
            if (/^\d*$/.test(e.target.value)) {
              setDuration(e.target.value);
            }
          }}
          onBlur={() => {
            if (duration === "") {
              setDuration(lastValidDuration);
              return;
            }

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
