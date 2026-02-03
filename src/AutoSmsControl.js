import React, { useState, useEffect } from "react";

export default function AutoSmsControl({ apiBase, autoSms, onChange }) {
  const [enabled, setEnabled] = useState(false);
  const [intervalValue, setIntervalValue] = useState("300");
  const [lastValidInterval, setLastValidInterval] = useState("300");
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");

  // ✅ INIT sekali saat component mount
  useEffect(() => {
    setEnabled(autoSms.enabled);
    setIntervalValue(String(autoSms.interval));
    setLastValidInterval(String(autoSms.interval));
    setNumber(autoSms.number || "");
    setMessage(autoSms.message || "");
  }, []); // ⬅️ PENTING: kosong!

  // ✅ Sync hanya status enable dari backend
  useEffect(() => {
    setEnabled(autoSms.enabled);
  }, [autoSms.enabled]);

  const saveConfig = async (newEnabled, newInterval) => {
    try {
      const res = await fetch(`${apiBase}/config/auto-sms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          enabled: newEnabled,
          interval: newInterval,
          number,
          message,
        }),
      });

      const json = await res.json();

      onChange({
        enabled: json.enabled,
        interval: json.interval,
        number: json.number || "",
        message: json.message || "",
      });
    } catch (err) {
      console.error("Save config error:", err);
    }
  };

  const toggleAutoSms = () => {
    if (!enabled && (!number || !number.startsWith("+"))) {
      alert("Number must start with +");
      return;
    }

    const newEnabled = !enabled;
    setEnabled(newEnabled);
    saveConfig(newEnabled, parseInt(lastValidInterval, 10));
  };

  return (
    <div>
      <h3>📩 Auto SMS</h3>

      <label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={toggleAutoSms}
        />
        Enable
      </label>

      {/* INTERVAL */}
      <input
        disabled={enabled}
        value={intervalValue}
        onChange={(e) => setIntervalValue(e.target.value)}
        onBlur={() => {
          const v = parseInt(intervalValue, 10);

          if (!isNaN(v) && v >= 30 && v <= 3600) {
            setLastValidInterval(String(v));
            saveConfig(enabled, v);
          } else {
            setIntervalValue(lastValidInterval);
          }
        }}
        placeholder="Interval (30–3600s)"
      />

      {/* NUMBER */}
      <input
        disabled={enabled}
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        placeholder="+628xxxx"
      />

      {/* MESSAGE */}
      <textarea
        disabled={enabled}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message"
      />
    </div>
  );
}
