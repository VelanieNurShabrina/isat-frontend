import React, { useState } from "react";
import HistoryChart from "./HistoryChart";
import RealtimeSignal from "./RealtimeSignal";
import IntervalControl from "./IntervalControl";

function App() {
  // 🔹 Pakai backend Railway dulu untuk realtime dan chart
  const apiBase = "https://isat-backend-production.up.railway.app";

  const [interval, setInterval] = useState(10);

  return (
    <div style={{ padding: 20 }}>
      <h2>📡 IsatPhone Signal Dashboard</h2>
      <p>Signal values: RSSI (bars), dBm (power), BER (bit error rate)</p>

      <p style={{ color: "#777", fontSize: 13 }}>
        🌐 Mode: Cloud (Railway)
      </p>

      {/* Dropdown interval sementara nonaktif (karena cloud tidak handle polling Raspberry) */}
      <IntervalControl apiBase={apiBase} onIntervalChange={setInterval} />

      {/* Realtime dari Railway */}
      <RealtimeSignal apiBase={apiBase} />

      <div style={{ marginTop: 20 }}>
        <HistoryChart apiBase={apiBase} refreshInterval={interval} />
      </div>
    </div>
  );
}

export default App;
