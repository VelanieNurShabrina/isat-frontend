import React, { useState } from "react";
import HistoryChart from "./HistoryChart";
import RealtimeSignal from "./RealtimeSignal";
import IntervalControl from "./IntervalControl";
import CallControl from "./CallControl";

function App() {
  const apiBase = "https://isat-backend-production.up.railway.app";
  const tunnelBase = "/api";

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
      {/* ===== Header ===== */}
      <h2 style={{ margin: "0 0 8px 0" }}>📡 IsatPhone Signal Dashboard</h2>
      <p style={{ margin: "0 0 24px 0", color: "#555" }}>
        Signal values: RSSI (bars), dBm (power), BER (bit error rate)
      </p>

      {/* ===== Box IntervalControl di atas ===== */}
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <div
          style={{
            width: 360,
            minWidth: 320,
            boxSizing: "border-box",
          }}
        >
          <IntervalControl apiBase={tunnelBase} onIntervalChange={setInterval} />
        </div>
      </div>

      {/* ===== Realtime Signal + Call Control sejajar ===== */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 14, // 🔹 jarak lebih rapat antar box
          justifyContent: "flex-start",
          alignItems: "flex-start",
          marginBottom: 30,
        }}
      >
        {/* 🟦 Realtime Signal */}
        <div
          style={{
            width: 360,
            minWidth: 320,
            boxSizing: "border-box",
          }}
        >
          <RealtimeSignal apiBase={tunnelBase} />
        </div>

        {/* 📞 Call Control */}
        <div
          style={{
            width: 360,
            minWidth: 320,
            boxSizing: "border-box",
          }}
        >
          <CallControl apiBase={tunnelBase} />
        </div>
      </div>

      {/* ===== Grafik History ===== */}
      <div style={{ marginTop: 10 }}>
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
        
      </footer>
    </div>
  );
}

export default App;
