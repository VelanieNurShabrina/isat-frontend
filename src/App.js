import React, { useState } from "react";
import HistoryChart from "./HistoryChart";
import RealtimeSignal from "./RealtimeSignal";
import IntervalControl from "./IntervalControl";

function App() {
  // 🔹 Gunakan ngrok (Raspberry lokal) untuk API utama
  const apiBase = "https://nonrelated-spirometrical-ashley.ngrok-free.dev";

  // 🔹 Interval refresh data (default 10 detik)
  const [interval, setInterval] = useState(10);

  return (
    <div style={{ padding: 20 }}>
      <h2>📡 IsatPhone Signal Dashboard</h2>
      <p>Signal values: RSSI (bars), dBm (power), BER (bit error rate)</p>

      {/* 🔹 Kontrol interval — ubah frekuensi polling di Raspberry */}
      <IntervalControl apiBase={apiBase} onIntervalChange={setInterval} />

      {/* 🔹 Realtime signal langsung dari Raspberry */}
      <RealtimeSignal apiBase={apiBase} />

      {/* 🔹 Grafik history — ambil data log dari Raspberry juga */}
      <div style={{ marginTop: 20 }}>
        <HistoryChart apiBase={apiBase} refreshInterval={interval} />
      </div>
    </div>
  );
}

export default App;
