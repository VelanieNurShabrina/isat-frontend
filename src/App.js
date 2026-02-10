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
import CallStats from "./CallStats";
import CallLogTable from "./CallLogTable";

function App() {
  const apiBase = "https://heterophoric-franco-unplumbed.ngrok-free.dev";

  const [signalInterval, setSignalInterval] = useState(10);
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

        if (typeof json.interval === "number") setSignalInterval(json.interval);

        if (json.auto_call) setAutoCall(json.auto_call);
        if (json.auto_sms) setAutoSms(json.auto_sms);

        if (typeof json.call_active === "boolean") setIsCalling(json.call_active);
      } catch {}
    };

    fetchStatus();
    const t = setInterval(fetchStatus, 1000);
    return () => clearInterval(t);
  }, []);

  const colors = {
    bg: "#f4f6f9",
    card: "#ffffff",
    border: "#e5e7eb",
    text: "#111827",
    muted: "#6b7280",
  };

  const cardStyle = {
    background: colors.card,
    padding: 20,
    borderRadius: 12,
    border: `1px solid ${colors.border}`,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: colors.bg, fontFamily: "Inter, sans-serif" }}>

      {/* SIDEBAR */}
      <aside style={{
        width: 280,
        background: "#fff",
        borderRight: `1px solid ${colors.border}`,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 24
      }}>
        <div>
          <h2 style={{ margin: 0 }}>📡 IsatPhone</h2>
          <p style={{ fontSize: 12, color: colors.muted }}>Monitoring System</p>
        </div>

        <div>
          <small style={{ color: colors.muted }}>SYSTEM STATUS</small>
          <SystemStatusCard status={systemStatus} />
        </div>

        <div>
          <small style={{ color: colors.muted }}>INTERVAL</small>
          <IntervalControl apiBase={apiBase} interval={signalInterval} onIntervalChange={setSignalInterval}/>
        </div>

        <div style={{ marginTop: "auto" }}>
          <CallStats apiBase={apiBase}/>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, padding: 30, display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Realtime */}
        <div style={cardStyle}>
          <RealtimeSignal apiBase={apiBase}/>
        </div>

        {/* Chart */}
        <div style={cardStyle}>
          <HistoryChart apiBase={apiBase} refreshInterval={signalInterval}/>
        </div>

        {/* Bottom Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={cardStyle}>
              <h3>📞 Call</h3>
              <CallControl apiBase={apiBase} isCalling={isCalling} autoCallRunning={autoCall.enabled} onCallStateChange={setIsCalling}/>
              <AutoCallControl apiBase={apiBase} autoCall={autoCall} onChange={setAutoCall}/>
            </div>

            <div style={cardStyle}>
              <h3>✉️ SMS</h3>
              <SmsControl apiBase={apiBase}/>
              <AutoSmsControl apiBase={apiBase} autoSms={autoSms} onChange={setAutoSms}/>
            </div>
          </div>

          {/* RIGHT */}
          <div style={cardStyle}>
            <h3>📋 Call Logs</h3>
            <div style={{ maxHeight: 500, overflowY: "auto" }}>
              <CallLogTable apiBase={apiBase}/>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
