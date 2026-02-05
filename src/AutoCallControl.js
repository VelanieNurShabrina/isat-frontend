import React, { useState, useEffect } from "react";

export default function AutoCallControl({ apiBase, autoCall, onChange }) {
  const [enabled, setEnabled] = useState(false);
  const [interval, setInterval] = useState("30");
  const [number, setNumber] = useState("");
  const [duration, setDuration] = useState("15");

  // 🔥 SYNC DARI BACKEND
  useEffect(() => {
    if (!autoCall) return;

    setEnabled(autoCall.enabled);
    setInterval(String(autoCall.interval || 30));
    setNumber(autoCall.number || "");
    setDuration(String(autoCall.duration || 15));
  }, [autoCall]);

  // ======================
  // SAVE CONFIG
  // ======================
  const saveConfig = async (newEnabled) => {
    const res = await fetch(`${apiBase}/config/auto-call`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({
        enabled: newEnabled,
        interval: parseInt(interval, 10),
        number,
        duration: parseInt(duration, 10),
      }),
    });

    const json = await res.json();
    onChange(json);
  };

  // ======================
  // TOGGLE
  // ======================
  const toggleAutoCall = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    saveConfig(newEnabled);
  };

  return (
    <div>
      <h3>🔁 Auto Call</h3>

      <label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={toggleAutoCall}
        />
        Enable
      </label>

      <input
        disabled={enabled}
        value={interval}
        onChange={(e) => setInterval(e.target.value)}
        placeholder="Interval (s)"
      />

      <input
        disabled={enabled}
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        placeholder="+8707xxxxxxx"
      />

      <input
        disabled={enabled}
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        placeholder="Duration (s)"
      />
    </div>
  );
}
