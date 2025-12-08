import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function HistoryChart({ apiBase, refreshInterval = 10 }) {
  const [data, setData] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);

  // ======================
  // FORMATTER WAKTU (lebih rapih)
  // ======================
  const timeFormatter = (time) =>
    new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    }).format(time);

  // ======================
  // FETCH DATA HISTORY
  // ======================
  const fetchHistory = async () => {
    try {
      let url = `${apiBase}/history?limit=500`;

      if (isFiltered && startTime && endTime) {
        const startUnix = Math.floor(new Date(startTime).getTime() / 1000);
        const endUnix = Math.floor(new Date(endTime).getTime() / 1000);
        url = `${apiBase}/history?start=${startUnix}&end=${endUnix}&limit=1000`;
      }

      const res = await fetch(url);
      const json = await res.json();
      if (!json.data || !Array.isArray(json.data)) return;

      // Ambil data terbaru, urutkan, convert timestamp → Date
      const latest = [...json.data]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 200)
        .sort((a, b) => a.timestamp - b.timestamp);

      const mapped = latest.map((d) => ({
        time: new Date(d.timestamp * 1000),
        rssi: d.rssi,
        dbm: d.dbm,
        ber: d.ber,
      }));

      setData(mapped);
      setLastUpdate(new Date());
    } catch (e) {
      console.error("❌ History fetch failed:", e);
    }
  };

  // ======================
  // AUTO REFRESH
  // ======================
  useEffect(() => {
    fetchHistory();
    if (!isFiltered) {
      const interval = setInterval(fetchHistory, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, isFiltered]);

  // ======================
  // FILTER ACTIONS
  // ======================
  const handleFilter = () => {
    if (startTime && endTime) {
      setIsFiltered(true);
      fetchHistory();
    }
  };

  const handleReset = () => {
    setIsFiltered(false);
    setStartTime("");
    setEndTime("");
    fetchHistory();
  };

  return (
    <div style={{ width: "100%", height: 420, marginTop: 20 }}>
      <h3 style={{ fontWeight: 600, marginBottom: 10 }}>Signal History (RSSI, dBm, BER)</h3>

      {/* Filter bar */}
      <div style={{ marginBottom: 10, display: "flex", gap: "10px" }}>
        <label>
          Start:
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            style={{ marginLeft: 5 }}
          />
        </label>
        <label>
          End:
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            style={{ marginLeft: 5 }}
          />
        </label>
        <button onClick={handleFilter}>Show</button>
        <button onClick={handleReset}>Reset</button>
      </div>

      {/* CHART */}
      <ResponsiveContainer width="100%" height={360} key={lastUpdate}>
        <LineChart data={data} margin={{ top: 10, right: 50, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />

          {/* X Axis waktu — sudah difix supaya tidak mepet */}
          <XAxis
            dataKey="time"
            tickFormatter={timeFormatter}
            stroke="#666"
            minTickGap={60}           // 🔥 bikin jarak antar tick lebih lega
            interval="preserveStartEnd" // 🔥 tampilkan tick penting saja
          />

          {/* Y Axis kiri (RSSI & BER) */}
          <YAxis
            yAxisId="left"
            domain={[0, 55]}
            label={{
              value: "RSSI",
              angle: -90,
              position: "insideLeft",
            }}
            stroke="#666"
          />

          {/* Y Axis kanan (dBm) */}
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[-140, -60]}
            label={{
              value: "dBm",
              angle: 90,
              position: "insideRight",
            }}
            stroke="#888"
          />

          {/* BER (orange) */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="ber"
            stroke="#ff7300"
            strokeWidth={2}
            dot={false}
            name="ber"
          />

          {/* RSSI (ungu) */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="rssi"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
            name="rssi"
          />

          {/* dBm (hijau) */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="dbm"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={false}
            name="dbm"
          />

          <Tooltip labelFormatter={(label) => `Time: ${timeFormatter(label)}`} />
          <Legend />
        </LineChart>
      </ResponsiveContainer>

      {/* FOOTER — UPDATE INFO */}
      {lastUpdate && (
        <p style={{ fontSize: 12, color: "#777", marginTop: 5 }}>
          ⏱ Updated every {refreshInterval} seconds — Last update:{" "}
          {lastUpdate.toLocaleTimeString("id-ID", { hour12: false })}
        </p>
      )}
    </div>
  );
}
