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

      // === FIX UTAMA ===
      // Ambil data terbaru → balikkan ke urutan grafik
      const latest = [...json.data]
        .sort((a, b) => b.timestamp - a.timestamp) // sort terbaru dulu
        .slice(0, 200)                              // ambil 200 terbaru
        .sort((a, b) => a.timestamp - b.timestamp); // urutkan kembali untuk ditampilkan

      const mapped = latest.map((d) => ({
        time: new Date(d.timestamp * 1000),
        rssi: d.rssi,
        dbm: d.dbm,
      }));

      setData(mapped);
      setLastUpdate(new Date());

      console.log(
        "Updated at:",
        mapped[mapped.length - 1]?.time?.toLocaleTimeString("id-ID", {
          hour12: false,
        })
      );

    } catch (e) {
      console.error("❌ History fetch failed:", e);
    }
  };

  useEffect(() => {
    fetchHistory();
    if (!isFiltered) {
      const interval = setInterval(fetchHistory, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, isFiltered]);

  const timeFormatter = (time) =>
    new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    }).format(time);

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
    <div style={{ width: "100%", height: 400, marginTop: 20 }}>
      <h3 style={{ fontWeight: "600", marginBottom: 10 }}>
        Signal History (RSSI and dBm)
      </h3>

      <div style={{ marginBottom: 10, display: "flex", gap: "8px" }}>
        <label>
          Start:
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>
        <label>
          End:
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>
        <button onClick={handleFilter}>Show</button>
        <button onClick={handleReset}>Reset</button>
      </div>

      <ResponsiveContainer width="100%" height={400} key={lastUpdate}>
        <LineChart data={data} margin={{ top: 10, right: 50, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="time"
            tickFormatter={timeFormatter}
            stroke="#666"
            minTickGap={60}
          />
          <YAxis
            yAxisId="left"
            domain={[0, 55]}
            label={{
              value: "RSSI",
              angle: -90,
              position: "insideLeft",
            }}
            stroke="#8884d8"
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[-140, -60]}
            label={{
              value: "dBm",
              angle: 90,
              position: "insideRight",
            }}
            stroke="#82ca9d"
          />

          <Tooltip
            labelFormatter={(label) => `Time: ${timeFormatter(label)}`}
          />
          <Legend />

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="rssi"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
          />

          <Line
            yAxisId="right"
            type="monotone"
            dataKey="dbm"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      {lastUpdate && (
        <p style={{ fontSize: 12, color: "#777" }}>
          Last update:{" "}
          {lastUpdate.toLocaleTimeString("id-ID", { hour12: false })}
        </p>
      )}
    </div>
  );
}
