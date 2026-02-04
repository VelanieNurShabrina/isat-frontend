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

        if (typeof json.interval === "number") {
          setSignalInterval(json.interval);
        }

        if (json.auto_call) {
          setAutoCall((prev) => {
            // update hanya kalau enable berubah
            if (prev.enabled !== json.auto_call.enabled) {
              return {
                enabled: json.auto_call.enabled,
                interval: json.auto_call.interval,
                number: json.auto_call.number || "",
                duration: json.auto_call.duration || 15,
              };
            }
            return prev;
          });
        }

        if (typeof json.call_active === "boolean") {
          setIsCalling(json.call_active);
        }
        if (json.auto_sms) {
          setAutoSms((prev) => {
            // update hanya kalau status enable berubah
            if (prev.enabled !== json.auto_sms.enabled) {
              return {
                enabled: json.auto_sms.enabled,
                interval: json.auto_sms.interval,
                number: json.auto_sms.number || "",
                message: json.auto_sms.message || "",
              };
            }
            return prev;
          });
        }
      } catch {}
    };

    fetchStatus();
    const timer = window.setInterval(fetchStatus, 1000);
    return () => window.clearInterval(timer);
  }, [apiBase]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%", // ⬅️ full width
        margin: 0, //
        padding: "24px 32px", // ⬅️ padding kiri-kanan
        fontFamily: "Segoe UI, Roboto, sans-serif",
      }}
    >
      {/* ===== HEADER ===== */}
      <div
        style={{
          marginBottom: 28,
          paddingBottom: 16,
          borderBottom: "1px solid #eee",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "#111",
          }}
        >
          📡 IsatPhone Monitoring Dashboard
        </h1>

        <p
          style={{
            marginTop: 8,
            fontSize: 14,
            color: "#555",
            maxWidth: 720,
          }}
        >
          Real-time monitoring of signal strength, call activity, SMS delivery,
          and historical performance (RSSI, dBm, BER).
        </p>
      </div>

      <div
        style={{
          flex: "1 1 360px",
          maxWidth: "420px",
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          border: "1px solid #eee",
        }}
      >
        <SystemStatusCard status={systemStatus} />
      </div>

      {/* ===== INTERVAL CONTROL CARD ===== */}
      <div
        style={{
          marginBottom: 30,
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          border: "1px solid #eee",
          maxWidth: "420px",
        }}
      >
        <IntervalControl
          apiBase={apiBase}
          interval={signalInterval}
          onIntervalChange={setSignalInterval}
        />
      </div>

      {/* ===== TOP CARDS: REALTIME + CALL ===== */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
          alignItems: "stretch",
        }}
      >
        {/* REALTIME SIGNAL */}
        <div
          style={{
            flex: "1 1 360px",
            maxWidth: "420px",
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            border: "1px solid #eee",
          }}
        >
          <RealtimeSignal apiBase={apiBase} />
        </div>

        {/* CALL CONTROL */}
        <div
          style={{
            flex: "1 1 360px",
            maxWidth: "420px",
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            border: "1px solid #eee",
          }}
        >
          <CallControl
            apiBase={apiBase}
            isCalling={isCalling}
            autoCallRunning={autoCall.enabled}
            onCallStateChange={setIsCalling}
          />
        </div>

        {/* AUTO CALL */}
        <div
          style={{
            flex: "1 1 360px",
            maxWidth: "420px",
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            border: "1px solid #eee",
          }}
        >
          <AutoCallControl
            apiBase={apiBase}
            autoCall={autoCall}
            onChange={setAutoCall}
          />
        </div>

        {/* SEND SMS */}
        <div
          style={{
            flex: "1 1 360px",
            maxWidth: "420px",
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            border: "1px solid #eee",
          }}
        >
          <SmsControl apiBase={apiBase} autoSmsRunning={autoSms.enabled} />
        </div>

        {/* AUTO SMS */}
        <div
          style={{
            flex: "1 1 360px",
            maxWidth: "420px",
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            border: "1px solid #eee",
          }}
        >
          <AutoSmsControl
            apiBase={apiBase}
            autoSms={autoSms}
            onChange={setAutoSms}
          />
        </div>
      </div>

      {/* ===== HISTORY CHART ===== */}
      <div
        style={{
          width: "100%",
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          border: "1px solid #eee",
        }}
      >
        <HistoryChart apiBase={apiBase} refreshInterval={signalInterval} />
      </div>

      {/* FOOTER */}
      <p
        style={{
          marginTop: 30,
          fontSize: 12,
          color: "#888",
          textAlign: "center",
        }}
      >
        © {new Date().getFullYear()} IsatPhone Monitoring Dashboard by Velanie
      </p>
    </div>
  );
}

export default App;
