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
  // Semua request lewat Vercel -> /api -> proxy -> ngrok -> Flask
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

  // Saat halaman pertama kali load, sync ke backend /status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${apiBase}/status`, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });
        if (!res.ok) return;

        const json = await res.json();
        setSystemStatus(json);

        // ===== SIGNAL INTERVAL =====
        if (typeof json.interval === "number") {
          setSignalInterval(json.interval);
        }

        // ===== AUTO CALL SYNC (FULL SYNC) =====
        if (json.auto_call) {
          setAutoCall({
            enabled: json.auto_call.enabled,
            interval: json.auto_call.interval,
            number: json.auto_call.number || "",
            duration: json.auto_call.duration || 15,
          });
        }

        // ===== AUTO SMS SYNC (FULL SYNC) =====
        if (json.auto_sms) {
          setAutoSms({
            enabled: json.auto_sms.enabled,
            interval: json.auto_sms.interval,
            number: json.auto_sms.number || "",
            message: json.auto_sms.message || "",
          });
        }

        // ===== CALL STATE =====
        if (typeof json.call_active === "boolean") {
          setIsCalling(json.call_active);
        }
      } catch (e) {
        console.log("Status fetch error:", e);
      }
    };

    fetchStatus();
    const timer = window.setInterval(fetchStatus, 1000);
    return () => window.clearInterval(timer);
  }, [apiBase]);

  // Ganti bagian return di App.js kamu
  return (
    <div
      style={{
        backgroundColor: "#f4f7f9",
        minHeight: "100vh",
        padding: "24px",
      }}
    >
      {/* HEADER SECTION */}
      <header style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
          📡 IsatPhone Monitoring
        </h1>
        <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
          <SystemStatusCard status={systemStatus} />
          <IntervalControl
            apiBase={apiBase}
            interval={signalInterval}
            onIntervalChange={setSignalInterval}
          />
        </div>
      </header>

      {/* MAIN GRID - 3 Kolom */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        {/* Kolom 1: Signal & Stats */}
        <div className="card-group">
          <RealtimeSignal apiBase={apiBase} />
          <div style={{ marginTop: "20px" }}>
            <CallStats apiBase={apiBase} />
          </div>
        </div>

        {/* Kolom 2: Call Controls */}
        <div className="card-group">
          <CallControl
            apiBase={apiBase}
            isCalling={isCalling}
            autoCallRunning={autoCall.enabled}
            onCallStateChange={setIsCalling}
          />
          <div style={{ marginTop: "20px" }}>
            <AutoCallControl
              apiBase={apiBase}
              autoCall={autoCall}
              onChange={setAutoCall}
            />
          </div>
        </div>

        {/* Kolom 3: SMS Controls */}
        <div className="card-group">
          <SmsControl apiBase={apiBase} autoSmsRunning={autoSms.enabled} />
          <div style={{ marginTop: "20px" }}>
            <AutoSmsControl
              apiBase={apiBase}
              autoSms={autoSms}
              onChange={setAutoSms}
            />
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: CHART & LOGS */}
      <div
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}
      >
        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <HistoryChart apiBase={apiBase} refreshInterval={signalInterval} />
        </div>
        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            maxHeight: "500px",
            overflowY: "auto",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Recent Logs</h3>
          <CallLogTable apiBase={apiBase} />
        </div>
      </div>
    </div>
  );
}

export default App;
