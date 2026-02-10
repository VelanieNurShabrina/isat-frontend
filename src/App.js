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
  const colors = {
    bg: "#f4f7fa",
    sidebar: "#ffffff",
    border: "#e1e4e8",
    accent: "#0052cc",
    textMain: "#172b4d",
    textMuted: "#5e6c84"
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: colors.bg, fontFamily: "'Inter', sans-serif", color: colors.textMain }}>
      
      {/* LEFT SIDEBAR - Fixed Status & Config */}
      <aside style={{ 
        width: "320px", 
        backgroundColor: colors.sidebar, 
        borderRight: `1px solid ${colors.border}`, 
        padding: "24px", 
        display: "flex", 
        flexDirection: "column",
        gap: "24px",
        position: "sticky",
        top: 0,
        height: "100vh"
      }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
            📡 IsatPhone
          </h1>
          <p style={{ fontSize: "12px", color: colors.textMuted, margin: 0 }}>Terminal Monitoring System</p>
        </div>

        <div className="sidebar-group">
          <label style={{ fontSize: "11px", fontWeight: "bold", color: colors.textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>Device Status</label>
          <div style={{ marginTop: "12px" }}>
            <SystemStatusCard status={systemStatus} />
          </div>
        </div>

        <div className="sidebar-group">
          <label style={{ fontSize: "11px", fontWeight: "bold", color: colors.textMuted, textTransform: "uppercase", letterSpacing: "1px" }}>Reporting Rate</label>
          <div style={{ marginTop: "12px" }}>
            <IntervalControl apiBase={apiBase} interval={signalInterval} onIntervalChange={setSignalInterval} />
          </div>
        </div>

        <div className="sidebar-group" style={{ marginTop: "auto" }}>
          <div style={{ padding: "16px", backgroundColor: "#f9fafb", borderRadius: "8px", border: `1px solid ${colors.border}` }}>
            <CallStats apiBase={apiBase} />
          </div>
          <p style={{ fontSize: "10px", textAlign: "center", marginTop: "16px", color: "#a1a1a1" }}>© 2026 Velanie Dashboard</p>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
        
        {/* TOP ROW: Realtime KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px", marginBottom: "24px" }}>
          <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", border: `1px solid ${colors.border}` }}>
            <RealtimeSignal apiBase={apiBase} />
          </div>
        </div>

        {/* MIDDLE ROW: History Chart (Large) */}
        <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", border: `1px solid ${colors.border}`, marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", margin: 0 }}>Signal Level Trend</h3>
            <span style={{ fontSize: "12px", color: colors.textMuted }}>Updated: {new Date().toLocaleTimeString()}</span>
          </div>
          <HistoryChart apiBase={apiBase} refreshInterval={signalInterval} />
        </div>

        {/* BOTTOM ROW: Controls & Logs (Grid 2 Kolom) */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }}>
          
          {/* Action Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Call Control Box */}
            <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", border: `1px solid ${colors.border}` }}>
              <h3 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>📞 Voice Command</h3>
              <CallControl apiBase={apiBase} isCalling={isCalling} autoCallRunning={autoCall.enabled} onCallStateChange={setIsCalling} />
              <div style={{ marginTop: "16px", padding: "16px", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "1px dashed #d1d5db" }}>
                <AutoCallControl apiBase={apiBase} autoCall={autoCall} onChange={setAutoCall} />
              </div>
            </div>

            {/* SMS Control Box */}
            <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", border: `1px solid ${colors.border}` }}>
              <h3 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>✉️ SMS Messaging</h3>
              <SmsControl apiBase={apiBase} autoSmsRunning={autoSms.enabled} />
              <div style={{ marginTop: "16px", padding: "16px", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "1px dashed #d1d5db" }}>
                <AutoSmsControl apiBase={apiBase} autoSms={autoSms} onChange={setAutoSms} />
              </div>
            </div>
          </div>

          {/* Logs Column */}
          <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", border: `1px solid ${colors.border}`, maxHeight: "800px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "16px" }}>Recent Activity Logs</h3>
            <div style={{ overflowY: "auto", flex: 1 }}>
              <CallLogTable apiBase={apiBase} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
