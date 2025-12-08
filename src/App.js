import React, { useState } from "react";
import HistoryChart from "./HistoryChart";
import RealtimeSignal from "./RealtimeSignal";
import IntervalControl from "./IntervalControl";
import CallControl from "./CallControl";

function App() {
  const apiBase = "/api"; // melalui proxy vercel
  const [interval, setInterval] = useState(10);

  return (
    <div
      style={{
        width: "95%",               // <<< lebih lebar
        maxWidth: "1500px",         // <<< chart dapat ruang lebih besar
        margin: "0 auto",
        padding: "30px 24px",
        fontFamily: "Segoe UI, Roboto, sans-serif",
      }}
    >
      {/* ===== HEADER ===== */}
      <h2 style={{ marginBottom: 6 }}>📡 IsatPhone Signal Dashboard</h2>
      <p style={{ marginBottom: 25, color: "#666" }}>
        Signal values: RSSI (bars), dBm (power), BER (bit error rate)
      </p>

      {/* ===== INTERVAL CONTROL ===== */}
      <div
        style={{
          marginBottom: 24,
          maxWidth: 350,
        }}
      >
        <IntervalControl apiBase={apiBase} onIntervalChange={setInterval} />
      </div>

      {/* ===== TOP CARDS ===== */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {/* REALTIME SIGNAL CARD */}
        <div
          style={{
            flex: "1 1 350px",
            minWidth: "330px",
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            border: "1px solid #eee",
          }}
        >
          <RealtimeSignal apiBase={apiBase} />
        </div>

        {/* CALL CONTROL CARD */}
        <div
          style={{
            flex: "1 1 350px",
            minWidth: "330px",
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            border: "1px solid #eee",
          }}
        >
          <CallControl apiBase={apiBase} />
        </div>
      </div>

      {/* ===== HISTORY CHART ===== */}
      <div
        style={{
          width: "100%",
          background: "#fff",
          padding: "25px",
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
