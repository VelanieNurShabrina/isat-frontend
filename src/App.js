import React, { useState } from "react";
import HistoryChart from "./HistoryChart";
import RealtimeSignal from "./RealtimeSignal";
import IntervalControl from "./IntervalControl";

function App() {
  const localBase = "http://192.168.100.135:5000"; // Raspberry API
  const cloudBase = "https://isat-backend-production.up.railway.app"; // Railway Cloud

  const [interval, setInterval] = useState(10);

  return (
    <div style={{ padding: 20 }}>
      <h2>📡 IsatPhone Signal Dashboard</h2>
      <p>Signal values: RSSI (bars), dBm (power), BER (bit error rate)</p>

      <IntervalControl apiBase={localBase} onIntervalChange={setInterval} />

      <RealtimeSignal apiBase={localBase} />

      <div style={{ marginTop: 20 }}>
        <HistoryChart apiBase={cloudBase} refreshInterval={interval} />
      </div>
    </div>
  );
}

export default App;
