import React, { useState } from "react";
import HistoryChart from "./HistoryChart";
import RealtimeSignal from "./RealtimeSignal";
import IntervalControl from "./IntervalControl";

function App() {
  // 🔹 Railway untuk data realtime & chart
  const apiBase = "https://isat-backend-production.up.railway.app";

  // 🔹 Raspberry via Cloudflare Tunnel khusus untuk interval
  const tunnelBase = "https://nonrelated-spirometrical-ashley.ngrok-free.app";


  const [interval, setInterval] = useState(10);

  return (
    <div style={{ padding: 20 }}>
      <h2>📡 IsatPhone Signal Dashboard</h2>
      <p>Signal values: RSSI (bars), dBm (power), BER (bit error rate)</p>

      <p style={{ color: "#777", fontSize: 13 }}>
        🌐 Mode: Cloud (Railway) — interval dikontrol dari Raspberry
      </p>

      {/* IntervalControl kirim ke Raspberry (bukan Railway) */}
      <IntervalControl apiBase={tunnelBase} onIntervalChange={setInterval} />

      {/* Realtime & Chart tetap ambil dari Railway */}
      <RealtimeSignal apiBase={apiBase} />
      <div style={{ marginTop: 20 }}>
        <HistoryChart apiBase={apiBase} refreshInterval={interval} />
      </div>
    </div>
  );
}

export default App;
