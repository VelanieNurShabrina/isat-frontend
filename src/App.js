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
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f0f2f5",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>{`
        .card { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .section-title { font-size: 14px; font-weight: 700; color: #374151; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        input, select, textarea { border: 1px solid #d1d5db !important; border-radius: 6px !important; padding: 8px 12px !important; font-size: 13px !important; width: 100%; box-sizing: border-box; }
        button { border-radius: 6px !important; font-weight: 600 !important; transition: all 0.2s; cursor: pointer; }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      {/* SIDEBAR */}
      <aside
        style={{
          width: 280,
          background: "#fff",
          borderRight: "1px solid #e5e7eb",
          padding: "30px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 32,
          position: "fixed",
          height: "100vh",
        }}
      >
        {/* TITLE */}
        <div>
          <h2
            style={{
              margin: 0,
              color: "#2563eb",
              fontSize: 18,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
            }}
          >
            <span>📡</span>
            <span>ISATPHONE MONITORING</span>
          </h2>
        </div>

        {/* ✅ LIVE SIGNAL (BARU) */}
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af" }}>
            LIVE SIGNAL
          </label>

          <div style={{ marginTop: 12 }}>
            <SidebarSignal apiBase={apiBase} />
          </div>
        </div>

        {/* INTERVAL */}
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af" }}>
            SIGNAL INTERVAL
          </label>

          <div style={{ marginTop: 12 }}>
            <IntervalControl
              apiBase={apiBase}
              interval={signalInterval}
              onIntervalChange={setSignalInterval}
            />
          </div>
        </div>

        {/* SYSTEM STATUS */}
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af" }}>
            SYSTEM STATUS
          </label>

          <div style={{ marginTop: 12 }}>
            <SystemStatusCard status={systemStatus} />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, marginLeft: 300, padding: 40 }}>
        {/* ROW 2: History Chart */}
        <div style={{ marginBottom: 24 }} className="card">
          <HistoryChart apiBase={apiBase} refreshInterval={signalInterval} />
        </div>

        {/* ROW 3: Controls & Logs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 24,
            alignItems: "start",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Call Action Group */}
            <div className="card">
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
                  📞 CALL CONTROL
                </h3>
                <div
                  style={{
                    width: 48,
                    height: 3,
                    background: "#dc2626",
                    borderRadius: 2,
                    marginTop: 6,
                  }}
                />
              </div>
              <CallControl
                apiBase={apiBase}
                isCalling={isCalling}
                autoCallRunning={autoCall.enabled}
                onCallStateChange={setIsCalling}
              />
              <div
                style={{
                  marginTop: 15,
                  paddingTop: 15,
                  borderTop: "1px dashed #e5e7eb",
                }}
              >
                <AutoCallControl
                  apiBase={apiBase}
                  autoCall={autoCall}
                  onChange={setAutoCall}
                />
              </div>
            </div>

            {/* SMS Action Group */}
            <div className="card">
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
                  ✉️ SMS CONTROL
                </h3>

                <div
                  style={{
                    width: 48,
                    height: 3,
                    background: "#2563eb",
                    borderRadius: 2,
                    marginTop: 6,
                  }}
                />
              </div>
              <SmsControl apiBase={apiBase} />
              <div
                style={{
                  marginTop: 15,
                  paddingTop: 15,
                  borderTop: "1px dashed #e5e7eb",
                }}
              >
                <AutoSmsControl
                  apiBase={apiBase}
                  autoSms={autoSms}
                  onChange={setAutoSms}
                />
              </div>
            </div>
          </div>

          {/* Logs Table */}
          <div
            className="card"
            style={{
              maxHeight: 800,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
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
                📋 ACTIVITY LOGS
              </h3>

              <div
                style={{
                  width: 48,
                  height: 3,
                  background: "#b4701e",
                  borderRadius: 2,
                  marginTop: 6,
                }}
              />
            </div>

            {/* CALL PERFORMANCE DI DALAM CARD */}
            <div
              style={{
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: 16,
              }}
            >
              <CallStats apiBase={apiBase} />
            </div>

            {/* LOG TABLE */}
            <div style={{ overflowY: "auto" }}>
              <CallLogTable apiBase={apiBase} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
