import React, { useState } from "react";

export default function AutoSmsControl({ apiBase, autoSms, onChange }) {
  // =========================
  // STATE
  // =========================
  const [enabled, setEnabled] = useState(autoSms.enabled);

  const [interval, setInterval] = useState(String(autoSms.interval));
  const [lastValidInterval, setLastValidInterval] = useState(
    String(autoSms.interval)
  );

  const [number, setNumber] = useState(autoSms.number || "");
  const [message, setMessage] = useState(autoSms.message || "");

  // =========================
  // SAVE CONFIG
  // =========================
  const saveConfig = async (newEnabled, newInterval, newMessage) => {
    try {
      await fetch(`${apiBase}/config/auto-sms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          enabled: newEnabled,
          interval: newInterval,
          number,
          message: newMessage,
        }),
      });

      onChange({
        enabled: newEnabled,
        interval: newInterval,
        number,
        message: newMessage,
      });
    } catch {
      // dashboard monitoring → ga perlu error merah
    }
  };

  // =========================
  // TOGGLE AUTO SMS
  // =========================
  const toggleAutoSms = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);

    saveConfig(
      newEnabled,
      parseInt(lastValidInterval, 10),
      message
    );
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
          📩 Auto SMS
        </h3>

        <div
          style={{
            width: 48,
            height: 3,
            background: "#0ea5e9",
            borderRadius: 2,
            marginTop: 6,
          }}
        />
      </div>

      {/* ENABLE */}
      <div style={{ marginBottom: 12 }}>
        <label>
          <input
            type="checkbox"
            checked={enabled}
            onChange={toggleAutoSms}
          />{" "}
          Enable Auto SMS
        </label>

        {enabled && (
          <div
            style={{
              marginTop: 6,
              padding: "6px 10px",
              background: "#dcfce7",
              color: "#166534",
              borderRadius: 6,
              fontSize: 12,
            }}
          >
            🟢 Auto SMS is running
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
            const val = parseInt(interval, 10);
            if (!isNaN(val) && val >= 30 && val <= 3600) {
              setLastValidInterval(interval);
              saveConfig(enabled, val, message);
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
          placeholder="+62xxxxxxxxxx"
          style={inputStyle}
        />
      </div>

      {/* MESSAGE */}
      <div style={{ marginTop: 12 }}>
        <label>Message</label>
        <textarea
          disabled={enabled}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="Auto SMS message"
          style={{
            ...inputStyle,
            resize: "vertical",
          }}
        />
      </div>
    </div>
  );
}

// =========================
// STYLE
// =========================
const inputStyle = {
  width: "100%",
  padding: "8px",
  marginTop: 4,
  borderRadius: 6,
  border: "1px solid #ccc",
};
