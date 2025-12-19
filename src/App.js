// src/App.js
import React, { useState, useEffect } from "react";
import HistoryChart from "./HistoryChart";
import RealtimeSignal from "./RealtimeSignal";
import IntervalControl from "./IntervalControl";
import CallControl from "./CallControl";
import SmsControl from "./SmsControl";

function App() {
  // Semua request lewat Vercel -> /api -> proxy -> ngrok -> Flask
  const apiBase = "/api";

  const [interval, setInterval] = useState(10);
  const [isCalling, setIsCalling] = useState(false);

  // Saat halaman pertama kali load, sync ke backend /status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${apiBase}/status`);
        if (!res.ok) return;
        const json = await res.json();

        if (typeof json.interval === "number") {
          setInterval(json.interval);
        }
        if (typeof json.call_active === "boolean") {
          setIsCalling(json.call_active);
        }
      } catch (err) {
        console.error("Failed to fetch status:", err);
      }
    };

    fetchStatus();
  }, [apiBase]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%", // ⬅️ full width
        margin: 0, // ⬅️ HAPUS center
        padding: "24px 32px", // ⬅️ padding kiri-kanan aja
        fontFamily: "Segoe UI, Roboto, sans-serif",
      }}
    >
      {/* ===== HEADER ===== */}
      <h2 style={{ marginBottom: 6 }}>📡 IsatPhone Monitoring Dashboard</h2>
      <p style={{ marginBottom: 25, color: "#666" }}>
        Signal values: RSSI (bars), dBm (power), BER (bit error rate)
      </p>

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
          interval={interval}
          onIntervalChange={setInterval}
        />
      </div>

      {/* ===== TOP CARDS: REALTIME + CALL ===== */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
          alignItems: "stretch", // ⬅️ penting biar tinggi sejajar
        }}
      >
        {/* REALTIME SIGNAL */}
        <div
          style={{
            flex: 1,
            minWidth: 320,
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
            flex: 1,
            minWidth: 320,
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
            onCallStateChange={setIsCalling}
          />
        </div>

        {/* SEND SMS */}
        <div
          style={{
            flex: 1,
            minWidth: 320,
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            border: "1px solid #eee",
          }}
        >
          <SmsControl apiBase={apiBase} />
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
        <HistoryChart apiBase={apiBase} refreshInterval={interval} />
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
        © {new Date().getFullYear()} ISAT Monitoring Dashboard by Velanie
      </p>
    </div>
  );
}

export default App;
