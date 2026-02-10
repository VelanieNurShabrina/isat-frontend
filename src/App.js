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

  const cardStyle = {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    border: "1px solid #eef0f2",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  };

  // Ganti bagian return di App.js kamu
  return (
    <div
      style={{
        backgroundColor: "#f4f7f9",
        minHeight: "100vh",
        padding: "32px",
        fontFamily: "Segoe UI, Roboto, sans-serif",
      }}
    >
      {/* 1. HEADER SECTION */}
      <div
        style={{
          marginBottom: "30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "26px",
              fontWeight: "800",
              color: "#1a1f36",
            }}
          >
            📡 IsatPhone Monitoring
          </h1>
          <p style={{ color: "#697386", margin: "5px 0 0 0" }}>
            Satellite Communication Real-time Dashboard
          </p>
        </div>

        {/* Quick Status di pojok kanan atas */}
        <div style={{ display: "flex", gap: "15px" }}>
          <SystemStatusCard status={systemStatus} />
          <IntervalControl
            apiBase={apiBase}
            interval={signalInterval}
            onIntervalChange={setSignalInterval}
          />
        </div>
      </div>

      {/* 2. MAIN GRID (3 Kolom untuk Controls) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
          marginBottom: "24px",
        }}
      >
        {/* Kolom 1: Signal & Stats */}
        <div style={cardStyle}>
          <h3 style={{ margin: 0, fontSize: "16px", color: "#4f5b76" }}>
            Signal Performance
          </h3>
          <RealtimeSignal apiBase={apiBase} />
          <div
            style={{
              marginTop: "auto",
              paddingTop: "15px",
              borderTop: "1px solid #eee",
            }}
          >
            <CallStats apiBase={apiBase} />
          </div>
        </div>

        {/* Kolom 2: Call Control (Manual & Auto) */}
        <div style={cardStyle}>
          <h3 style={{ margin: 0, fontSize: "16px", color: "#4f5b76" }}>
            Call Management
          </h3>
          <CallControl
            apiBase={apiBase}
            isCalling={isCalling}
            autoCallRunning={autoCall.enabled}
            onCallStateChange={setIsCalling}
          />
          <div
            style={{
              padding: "15px",
              background: "#f8f9fc",
              borderRadius: "8px",
            }}
          >
            <AutoCallControl
              apiBase={apiBase}
              autoCall={autoCall}
              onChange={setAutoCall}
            />
          </div>
        </div>

        {/* Kolom 3: SMS Control (Manual & Auto) */}
        <div style={cardStyle}>
          <h3 style={{ margin: 0, fontSize: "16px", color: "#4f5b76" }}>
            SMS Messaging
          </h3>
          <SmsControl apiBase={apiBase} autoSmsRunning={autoSms.enabled} />
          <div
            style={{
              padding: "15px",
              background: "#f8f9fc",
              borderRadius: "8px",
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

      {/* 3. BOTTOM SECTION (Chart Lebar & Log di Samping) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        {/* Chart History */}
        <div style={cardStyle}>
          <h3 style={{ margin: 0, fontSize: "16px", color: "#4f5b76" }}>
            Signal History (dBm & BER)
          </h3>
          <HistoryChart apiBase={apiBase} refreshInterval={signalInterval} />
        </div>

        {/* Recent Logs */}
        <div style={{ ...cardStyle, maxHeight: "550px", overflow: "hidden" }}>
          <h3 style={{ margin: 0, fontSize: "16px", color: "#4f5b76" }}>
            Recent Activity Logs
          </h3>
          <div style={{ overflowY: "auto" }}>
            <CallLogTable apiBase={apiBase} />
          </div>
        </div>
      </div>

      <footer
        style={{
          marginTop: "40px",
          textAlign: "center",
          color: "#a3acb9",
          fontSize: "13px",
        }}
      >
        © {new Date().getFullYear()} IsatPhone Monitoring Dashboard • Powered by
        Velanie
      </footer>
    </div>
  );
}

export default App;
