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
  const [autoCall, setAutoCall] = useState({});
  const [autoSms, setAutoSms] = useState({});
  const [systemStatus, setSystemStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${apiBase}/status`, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });
        const json = await res.json();

        setSystemStatus(json);
        if (json.interval) setSignalInterval(json.interval);
        if (json.auto_call) setAutoCall(json.auto_call);
        if (json.auto_sms) setAutoSms(json.auto_sms);
        if (typeof json.call_active === "boolean") setIsCalling(json.call_active);
      } catch {}
    };

    fetchStatus();
    const t = setInterval(fetchStatus, 1000);
    return () => clearInterval(t);
  }, []);

  // 🎯 NOC THEME
  const theme = {
    bg: "#0f172a",
    card: "#111827",
    border: "#1f2933",
    text: "#e5e7eb",
    muted: "#9ca3af",
    accent: "#22c55e",
  };

  const card = {
    background: theme.card,
    border: `1px solid ${theme.border}`,
    borderRadius: 10,
    padding: 18,
    color: theme.text,
  };

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: theme.bg,
      color: theme.text,
      fontFamily: "Segoe UI, sans-serif"
    }}>

      {/* SIDEBAR */}
      <aside style={{
        width: 240,
        background: "#020617",
        borderRight: `1px solid ${theme.border}`,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 20
      }}>
        <h2 style={{ margin: 0, color: theme.accent }}>
          🛰 NOC PANEL
        </h2>

        <SystemStatusCard status={systemStatus}/>
        <IntervalControl
          apiBase={apiBase}
          interval={signalInterval}
          onIntervalChange={setSignalInterval}
        />

        <div style={{ marginTop: "auto" }}>
          <CallStats apiBase={apiBase}/>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{
        flex: 1,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 20
      }}>

        {/* KPI */}
        <div style={card}>
          <RealtimeSignal apiBase={apiBase}/>
        </div>

        {/* BIG CHART */}
        <div style={{ ...card, height: 360 }}>
          <HistoryChart
            apiBase={apiBase}
            refreshInterval={signalInterval}
          />
        </div>

        {/* BOTTOM GRID */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20
        }}>

          {/* LEFT CONTROLS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={card}>
              <h3 style={{ marginTop: 0 }}>📞 CALL CONTROL</h3>
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
            </div>

            <div style={card}>
              <h3 style={{ marginTop: 0 }}>✉️ SMS CONTROL</h3>
              <SmsControl apiBase={apiBase}/>
              <AutoSmsControl
                apiBase={apiBase}
                autoSms={autoSms}
                onChange={setAutoSms}
              />
            </div>
          </div>

          {/* RIGHT LOGS */}
          <div style={card}>
            <h3 style={{ marginTop: 0 }}>📋 CALL LOGS</h3>
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
