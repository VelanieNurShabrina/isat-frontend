// src/App.js
import React, { useState, useEffect } from "react";
import HistoryChart from "./HistoryChart";
import RealtimeSignal from "./RealtimeSignal";
import IntervalControl from "./IntervalControl";
import CallControl from "./CallControl";
import SmsControl from "./SmsControl";
import AutoCallControl from "./AutoCallControl";
import AutoSmsControl from "./AutoSmsControl"; // ⬅️ BARU

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

  // ⬇️ BARU
  const [autoSms, setAutoSms] = useState({
    enabled: false,
    interval: 300,
    number: "",
    message: "",
  });

  // =========================
  // SYNC STATUS DARI BACKEND
  // =========================
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${apiBase}/status`, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });
        if (!res.ok) return;
        const json = await res.json();

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

        // ⬇️ BARU
        if (json.auto_sms) {
          setAutoSms({
            enabled: json.auto_sms.enabled,
            interval: json.auto_sms.interval,
            number: json.auto_sms.number || "",
            message: json.auto_sms.message || "",
          });
        }

        if (typeof json.call_active === "boolean") {
          setIsCalling(json.call_active);
        }
      } catch {}
    };

    fetchStatus();
    const t = setInterval(fetchStatus, 2000);
    return () => clearInterval(t);
  }, [apiBase]);

  return (
    <div
      style={{
        width: "100%",
        padding: "24px 32px",
        fontFamily: "Segoe UI, Roboto, sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          marginBottom: 28,
          paddingBottom: 16,
          borderBottom: "1px solid #eee",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>
          📡 IsatPhone Monitoring Dashboard
        </h1>
        <p style={{ marginTop: 8, fontSize: 14, color: "#555" }}>
          Real-time monitoring of signal, call, and SMS activity.
        </p>
      </div>

      {/* INTERVAL */}
      <div style={cardStyle}>
        <IntervalControl
          apiBase={apiBase}
          interval={interval}
          onIntervalChange={setInterval}
        />
      </div>

      {/* TOP CARDS */}
      <div style={{ display: "flex", gap: 20, marginBottom: 30 }}>
        <div style={cardStyle}>
          <RealtimeSignal apiBase={apiBase} />
        </div>

        <div style={cardStyle}>
          <CallControl
            apiBase={apiBase}
            isCalling={isCalling}
            autoCallRunning={autoCall.enabled}
            onCallStateChange={setIsCalling}
          />
        </div>

        <div style={cardStyle}>
          <AutoCallControl
            apiBase={apiBase}
            autoCall={autoCall}
            onChange={setAutoCall}
          />
        </div>

        {/* ⬇️ AUTO SMS CARD */}
        <div style={cardStyle}>
          <AutoSmsControl
            apiBase={apiBase}
            autoSms={autoSms}
            onChange={setAutoSms}
          />
        </div>

        <div style={cardStyle}>
          <SmsControl apiBase={apiBase} />
        </div>
      </div>

      {/* HISTORY */}
      <div style={cardStyle}>
        <HistoryChart apiBase={apiBase} refreshInterval={interval} />
      </div>

      <p style={{ marginTop: 30, fontSize: 12, color: "#888", textAlign: "center" }}>
        © {new Date().getFullYear()} IsatPhone Monitoring Dashboard by Velanie
      </p>
    </div>
  );
}

const cardStyle = {
  flex: "1 1 360px",
  maxWidth: "420px",
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  border: "1px solid #eee",
};

export default App;
