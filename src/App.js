import React, { useState } from "react";
import HistoryChart from "./HistoryChart";
import RealtimeSignal from "./RealtimeSignal";
import IntervalControl from "./IntervalControl";
import CallControl from "./CallControl";

function App() {
  // API backend cloud (Railway)
  const apiBase = "https://isat-backend-production.up.railway.app";
  // Tunnel langsung ke Raspberry Pi (ubah sesuai tunnel aktif kamu)
  const tunnelBase = "https://universal-improvement-nodes-corp.trycloudflare.com";

  const [interval, setInterval] = useState(10);

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "Segoe UI, Roboto, Arial, sans-serif",
        backgroundColor: "#fafafa",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ margin: "0 0 6px 0" }}>📡 IsatPhone Signal Dashboard</h2>
      <p style={{ margin: "0 0 18px 0", color: "#555" }}>
        Signal values: RSSI (bars), dBm (power), BER (bit error rate)
      </p>

      {/* ===== kontrol atas: interval (narrow) + call (medium) ===== */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 22,
          alignItems: "flex-start", // biar isi kotak bisa memanjang ke bawah
          flexWrap: "wrap",
        }}
      >
        {/* Panel Interval */}
        <div
          style={{
            width: 260, // sedikit dilebarkan biar tulisan nggak terpotong
            minWidth: 200,
            boxSizing: "border-box",
          }}
        >
          <IntervalControl apiBase={tunnelBase} onIntervalChange={setInterval} />
        </div>

        {/* Panel Call */}
        <div
          style={{
            width: 340,
            minWidth: 260,
            boxSizing: "border-box",
          }}
        >
          <CallControl apiBase={tunnelBase} />
        </div>
      </div>

      {/* ===== Realtime Signal full-width di bawah ===== */}
      <div style={{ marginBottom: 20 }}>
        <RealtimeSignal apiBase={apiBase} />
      </div>

      {/* ===== History chart ===== */}
      <div>
        <HistoryChart apiBase={apiBase} refreshInterval={interval} />
      </div>

      <footer
        style={{
          marginTop: 36,
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
