import React, { useState } from "react";
import HistoryChart from "./HistoryChart";
import RealtimeSignal from "./RealtimeSignal";
import IntervalControl from "./IntervalControl";

function App() {
  const apiBase = "https://nonrelated-spirometrical-ashley.ngrok-free.dev"; // pastikan tanpa spasi
  const [interval, setInterval] = useState(10);

  return (
    <div style={{ padding: 20 }}>
      <h2>📡 IsatPhone Signal Dashboard</h2>
      <p>Signal values: RSSI (bars), dBm (power), BER (bit error rate)</p>

      <IntervalControl apiBase={apiBase} onIntervalChange={setInterval} />
      <RealtimeSignal apiBase={apiBase} />

      <div style={{ marginTop: 20 }}>
        <HistoryChart apiBase={apiBase} refreshInterval={interval} />
      </div>
    </div>
  );
}

export default App;
