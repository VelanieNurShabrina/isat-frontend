import React, { useState, useEffect } from "react";

export default function AutoCallControl({ apiBase, autoCall, onChange }) {
  const [enabled, setEnabled] = useState(autoCall.enabled);

  const [interval, setInterval] = useState(String(autoCall.interval));
  const [lastValidInterval, setLastValidInterval] = useState(String(autoCall.interval));

  const [number, setNumber] = useState(autoCall.number || "");

  const [duration, setDuration] = useState(String(autoCall.duration));
  const [lastValidDuration, setLastValidDuration] = useState(String(autoCall.duration));

  // ✅ SYNC BACKEND → UI hanya saat DISABLED
  useEffect(() => {
    if (!enabled) {
      setInterval(String(autoCall.interval));
      setLastValidInterval(String(autoCall.interval));
      setDuration(String(autoCall.duration));
      setLastValidDuration(String(autoCall.duration));
      setNumber(autoCall.number || "");
    }

    setEnabled(autoCall.enabled);
  }, [autoCall]);

  const saveConfig = async (newEnabled, newInterval, newDuration) => {
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
        duration: newDuration,
      }),
    });

    const json = await res.json();

    onChange(json);
  };

  const toggleAutoCall = () => {
    if (!enabled && (!number || !number.startsWith("+"))) {
      alert("Destination number must start with +");
      return;
    }

    const newEnabled = !enabled;
    setEnabled(newEnabled);

    saveConfig(
      newEnabled,
      parseInt(lastValidInterval, 10),
      parseInt(lastValidDuration, 10)
    );
  };

  return (
    <div>
      <h3>🔁 Auto Call</h3>

      <label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={toggleAutoCall}
        /> Enable
      </label>

      <input
        disabled={enabled}
        value={interval}
        onChange={(e) =>
          /^\d*$/.test(e.target.value) && setInterval(e.target.value)
        }
        onBlur={() => {
          const v = parseInt(interval, 10);
          if (v >= 5 && v <= 600) {
            setLastValidInterval(interval);
            saveConfig(enabled, v, parseInt(lastValidDuration, 10));
          } else setInterval(lastValidInterval);
        }}
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
        onChange={(e) =>
          /^\d*$/.test(e.target.value) && setDuration(e.target.value)
        }
        onBlur={() => {
          const v = parseInt(duration, 10);
          if (v >= 5 && v <= 300) {
            setLastValidDuration(duration);
            saveConfig(enabled, parseInt(lastValidInterval, 10), v);
          } else setDuration(lastValidDuration);
        }}
        placeholder="Duration (s)"
      />
    </div>
  );
}
