import React, { useState } from "react";
import HistoryChart from "./HistoryChart";
import RealtimeSignal from "./RealtimeSignal";
import IntervalControl from "./IntervalControl";

function App() {
  // Semua API diarahkan ke Railway (HTTPS aman)
  const apiBase = "https://isat-backend-production.up.railway.app";

  const [interval, setInterval] = useState(10);

  return (
    <div style={{ padding: 20 }}>
      <h2>📡 IsatPhone Signal Dashboard</h2>
      <p>Signal values: RSSI (bars), dBm (power), BER (bit error rate)</p>

      {/* Interval & Realtime sama-sama ambil dari Railway */}
      <IntervalControl apiBase={apiBase} onIntervalChange={setInterval} />

      <RealtimeSignal apiBase={apiBase} />

      <div style={{ marginTop: 20 }}>
        {/* Grafik history juga ambil dari Railway */}
        <HistoryChart apiBase={apiBase} refreshInterval={interval} />
      </div>
    </div>
  );
}

export default App;
