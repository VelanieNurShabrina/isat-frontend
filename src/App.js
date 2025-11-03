import React, { useState } from "react";
import HistoryChart from "./HistoryChart";
import RealtimeSignal from "./RealtimeSignal";
import IntervalControl from "./IntervalControl";

function App() {
  // 🔹 URL backend Flask kamu (pastikan aktif)
  const apiBase = "https://nonrelated-spirometrical-ashley.ngrok-free.dev";

  // 🔹 Interval polling (detik)
  const [interval, setInterval] = useState(10);

  return (
    <div style={{ padding: 20 }}>
      <h2>📡 IsatPhone Signal Dashboard</h2>
      <p>Signal values: RSSI (bars), dBm (power), BER (bit error rate)</p>

      {/* Kontrol interval polling */}
      <IntervalControl apiBase={apiBase} onIntervalChange={setInterval} />

      {/* Data realtime signal */}
      <RealtimeSignal apiBase={apiBase} />

      {/* Grafik history */}
      <div style={{ marginTop: 20 }}>
        <HistoryChart apiBase={apiBase} refreshInterval={interval} />
      </div>
    </div>
  );
}

export default App;
