import React, { useState } from "react";
import HistoryChart from "./HistoryChart";
import RealtimeSignal from "./RealtimeSignal";
import IntervalControl from "./IntervalControl";
import CallControl from "./CallControl";

function App() {
  const apiBase = "https://isat-backend-production.up.railway.app";
  const tunnelBase = "https://universal-improvement-nodes-corp.trycloudflare.com";

  const [interval, setInterval] = useState(10);

  return (
    <div
      style={{
        padding: 40,
        fontFamily: "Segoe UI, Roboto, Arial, sans-serif",
        backgroundColor: "#fafafa",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ margin: "0 0 8px 0" }}>📡 IsatPhone Signal Dashboard</h2>
      <p style={{ margin: "0 0 22px 0", color: "#555" }}>
        Signal values: RSSI (bars), dBm (power), BER (bit error rate)
      </p>

      {/* ===== Bagian kontrol atas ===== */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 60, // 🔹 jarak horizontal antar box (lebih besar biar lega)
          marginBottom: 30,
        }}
      >
        {/* Box IntervalControl */}
        <div
          style={{
            width: 260,
            minWidth: 200,
            boxSizing: "border-box",
            background: "transparent",
            border: "none",
            boxShadow: "none",
          }}
        >
          <IntervalControl apiBase={tunnelBase} onIntervalChange={setInterval} />
        </div>

        {/* Box CallControl */}
        <div
          style={{
            width: 360,
            minWidth: 260,
            boxSizing: "border-box",
            background: "transparent",
            border: "none",
            boxShadow: "none",
            marginLeft: 20,
          }}
        >
          <CallControl apiBase={tunnelBase} />
        </div>
      </div>

      {/* ===== Realtime Signal ===== */}
      <div style={{ marginBottom: 25 }}>
        <RealtimeSignal apiBase={apiBase} />
      </div>

      {/* ===== History Chart ===== */}
      <div>
        <HistoryChart apiBase={apiBase} refreshInterval={interval} />
      </div>

      {/* ===== Footer ===== */}
      <footer
        style={{
          marginTop: 40,
          color: "#888",
          fontSize: 12,
          textAlign: "center",
        }}
      >
        ⏱ Updated automatically — Raspberry Pi & Isat backend synced
      </footer>
    </div>
  );
}

export default App;
