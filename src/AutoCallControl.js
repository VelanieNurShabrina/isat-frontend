import React, { useState, useEffect } from "react";

export default function AutoCallControl({ apiBase, autoCall, onChange }) {
  const [enabled, setEnabled] = useState(false);
  const [interval, setInterval] = useState("30");
  const [number, setNumber] = useState("");
  const [duration, setDuration] = useState("15");

  // 🔥 SYNC HANYA SAAT ENABLE CHANGED
  useEffect(() => {
    if (!autoCall) return;

    setEnabled(autoCall.enabled);

    // hanya update field saat enable ON
    if (autoCall.enabled) {
      setInterval(String(autoCall.interval || 30));
      setNumber(autoCall.number || "");
      setDuration(String(autoCall.duration || 15));
    }
  }, [autoCall.enabled]); // ← kunci fix di sini

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

  const toggleAutoCall = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    saveConfig(newEnabled);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <input
          type="checkbox"
          checked={enabled}
          onChange={toggleAutoCall}
          style={{ width: "auto" }}
        />
        <span style={{ fontSize: "13px", fontWeight: "600" }}>
          Enable Auto Call Cycle
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "8px",
        }}
      >
        <input
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          placeholder="Interval (s)"
          disabled={enabled}
        />
        <input
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Phone Number"
          disabled={enabled}
        />
        <input
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration (s)"
          disabled={enabled}
        />
      </div>
    </div>
  );
}
