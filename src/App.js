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
import SidebarSignal from "./SidebarSignal";
import SmsStats from "./SmsStats";
import SmsLogTable from "./SmsLogTable";

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
        if (typeof json.call_active === "boolean")
          setIsCalling(json.call_active);
      } catch {}
    };

    fetchStatus();
    const t = setInterval(fetchStatus, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#f0f2f5",
      fontFamily: "'Inter', sans-serif",
    }}>

      <style>{`
        .card { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        input, select, textarea { border: 1px solid #d1d5db !important; border-radius: 6px !important; padding: 8px 12px !important; font-size: 13px !important; width: 100%; box-sizing: border-box; }
        button { border-radius: 6px !important; font-weight: 600 !important; }
      `}</style>

      {/* SIDEBAR */}
      <aside style={{
        width: 280,
        background: "#fff",
        borderRight: "1px solid #e5e7eb",
        padding: "30px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 32,
        position: "fixed",
        height: "100vh",
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 30, fontWeight: 900, color: "#1e3a8a" }}>
            ISATPHONE
          </h2>
          <div style={{ fontSize: 20, fontWeight: 600, color: "#64748b" }}>
            Monitoring System
          </div>
        </div>

        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af" }}>
            LIVE SIGNAL
          </label>
          <SidebarSignal apiBase={apiBase} />
        </div>

        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af" }}>
            SIGNAL INTERVAL
          </label>
          <IntervalControl
            apiBase={apiBase}
            interval={signalInterval}
            onIntervalChange={setSignalInterval}
          />
        </div>

        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af" }}>
            SYSTEM STATUS
          </label>
          <SystemStatusCard status={systemStatus} />
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, marginLeft: 300, padding: 40 }}>

        <div className="card" style={{ marginBottom: 24 }}>
          <HistoryChart apiBase={apiBase} refreshInterval={signalInterval} />
        </div>

        {/* GRID */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: 24,
          alignItems: "start",
        }}>

          {/* LEFT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            <div className="card">
              <h3>📞 CALL CONTROL</h3>
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

            <div className="card">
              <h3>✉️ SMS CONTROL</h3>
              <SmsControl apiBase={apiBase} />
              <AutoSmsControl
                apiBase={apiBase}
                autoSms={autoSms}
                onChange={setAutoSms}
              />
            </div>

          </div>

          {/* RIGHT COLUMN (LOGS STACK) */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 24
          }}>

            {/* CALL LOGS */}
            <div className="card">
              <h3>📋 CALL ACTIVITY LOGS</h3>

              <div style={{
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: 16,
              }}>
                <CallStats apiBase={apiBase} />
              </div>

              <CallLogTable apiBase={apiBase} />
            </div>

            {/* SMS LOGS */}
            <div className="card">
              <h3>✉️ SMS ACTIVITY LOGS</h3>

              <div style={{
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: 16,
              }}>
                <SmsStats apiBase={apiBase} />
              </div>

              <SmsLogTable apiBase={apiBase} />
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

export default App;