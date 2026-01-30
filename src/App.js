// src/App.js
import React, { useState, useEffect } from "react";
import HistoryChart from "./HistoryChart";
import RealtimeSignal from "./RealtimeSignal";
import IntervalControl from "./IntervalControl";
import CallControl from "./CallControl";
import SmsControl from "./SmsControl";
import AutoCallControl from "./AutoCallControl";
import AutoSmsControl from "./AutoSmsControl";
import SystemStatusCard from "./SystemStatusCard";

function App() {
  const apiBase = "https://heterophoric-franco-unplumbed.ngrok-free.dev";

  const [interval, setInterval] = useState(10);
  const [isCalling, setIsCalling] = useState(false);

  const [autoCall, setAutoCall] = useState({
    enabled: false,
    interval: 30,
    number: "",
    duration: 15,
  });

  const [autoSms, setAutoSms] = useState({
    enabled: false,
    interval: 300,
    number: "",
    message: "",
  });

  const [systemStatus, setSystemStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${apiBase}/status`, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });
        if (!res.ok) return;
        const json = await res.json();

        setSystemStatus(json);

        if (typeof json.interval === "number") {
          setInterval(json.interval);
        }

        if (json.auto_call) {
          setAutoCall({
            enabled: json.auto_call.enabled,
            interval: json.auto_call.interval,
            number: json.auto_call.number || "",
            duration: json.auto_call.duration || 15,
          });
        }

        if (typeof json.call_active === "boolean") {
          setIsCalling(json.call_active);
        }

        if (json.auto_sms) {
          setAutoSms({
            enabled: json.auto_sms.enabled,
            interval: json.auto_sms.interval,
            number: json.auto_sms.number || "",
            message: json.auto_sms.message || "",
          });
        }
      } catch {}
    };

    fetchStatus();
    const t = setInterval(fetchStatus, 2000);
    return () => clearInterval(t);
  }, [apiBase]);

  return (
    <div style={{ padding: "24px 32px", fontFamily: "Segoe UI, Roboto" }}>
      <h1>📡 IsatPhone Monitoring Dashboard</h1>

      {/* SYSTEM STATUS */}
      <div style={{ marginBottom: 20, maxWidth: 420 }}>
        <SystemStatusCard status={systemStatus} />
      </div>

      <IntervalControl
        apiBase={apiBase}
        interval={interval}
        onIntervalChange={setInterval}
      />

      <div style={{ display: "flex", gap: 20, marginTop: 30 }}>
        <RealtimeSignal apiBase={apiBase} />

        <CallControl
          apiBase={apiBase}
          isCalling={isCalling}
          autoCallRunning={autoCall.enabled}
          onCallStateChange={setIsCalling}
        />

        <AutoCallControl
          apiBase={apiBase}
          autoCall={autoCall}
          onChange={setAutoCall}
        />

        <SmsControl apiBase={apiBase} />

        <AutoSmsControl
          apiBase={apiBase}
          autoSms={autoSms}
          onChange={setAutoSms}
        />
      </div>

      <HistoryChart apiBase={apiBase} refreshInterval={interval} />

      <p style={{ marginTop: 30, fontSize: 12, textAlign: "center" }}>
        © {new Date().getFullYear()} IsatPhone Monitoring Dashboard by Velanie
      </p>
    </div>
  );
}

export default App;
