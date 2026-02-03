import React, { useState, useEffect } from "react";

export default function AutoSmsControl({ apiBase, autoSms, onChange }) {
  const [enabled, setEnabled] = useState(autoSms.enabled);
  const [intervalValue, setIntervalValue] = useState(
    String(autoSms.interval)
  );
  const [lastValidInterval, setLastValidInterval] = useState(
    String(autoSms.interval)
  );
  const [number, setNumber] = useState(autoSms.number || "");
  const [message, setMessage] = useState(autoSms.message || "");

  useEffect(() => {
    setEnabled(autoSms.enabled);
    setIntervalValue(String(autoSms.interval));
    setLastValidInterval(String(autoSms.interval));
    setNumber(autoSms.number || "");
    setMessage(autoSms.message || "");
  }, [autoSms]);

  const saveConfig = async (newEnabled, newInterval) => {
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
  };

  const toggleAutoSms = () => {
    if (!enabled && (!number || !number.startsWith("+"))) {
      alert("Destination number must start with +");
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
        <input type="checkbox" checked={enabled} onChange={toggleAutoSms} /> Enable
      </label>

      <input
        disabled={enabled}
        value={intervalValue}
        onChange={(e) =>
          /^\d*$/.test(e.target.value) && setIntervalValue(e.target.value)
        }
        onBlur={() => {
          const v = parseInt(intervalValue, 10);
          if (v >= 30 && v <= 3600) {
            setLastValidInterval(intervalValue);
            saveConfig(enabled, v);
          } else setIntervalValue(lastValidInterval);
        }}
        placeholder="Interval (s)"
      />

      <input
        disabled={enabled}
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        placeholder="+62xxxxxxxxxx"
      />

      <textarea
        disabled={enabled}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message"
      />
    </div>
  );
}
