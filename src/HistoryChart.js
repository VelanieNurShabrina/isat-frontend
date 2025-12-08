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
      let url = `${apiBase}/history?limit=300`;

      if (isFiltered && startTime && endTime) {
        const startUnix = Math.floor(new Date(startTime).getTime() / 1000);
        const endUnix = Math.floor(new Date(endTime).getTime() / 1000);
        url += `&start=${startUnix}&end=${endUnix}`;
      }

      const res = await fetch(url);
      const json = await res.json();

      if (json.data) {
        setData(json.data);
        setLastUpdate(new Date());
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
    const t = setInterval(fetchHistory, refreshInterval * 1000);
    return () => clearInterval(t);
  }, [isFiltered, startTime, endTime]);

  const formatTime = (ts) => {
    if (!ts) return "";
    const d = new Date(ts * 1000);
    return d.toLocaleTimeString();
  };

  const handleFilter = () => {
    if (!startTime || !endTime) {
      alert("Isi start dan end time!");
      return;
    }
    setIsFiltered(true);
    fetchHistory();
  };

  const handleReset = () => {
    setIsFiltered(false);
    setStartTime("");
    setEndTime("");
    fetchHistory();
  };

  return (
    <div style={{ width: "100%", marginTop: "10px" }}>
      <h3 style={{ marginBottom: "12px" }}>
        Signal History (RSSI, dBm, BER)
      </h3>

      {/* FILTER BAR */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "15px",
        }}
      >
        <span>Start:</span>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />

        <span>End:</span>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />

        <button onClick={handleFilter}>Show</button>
        <button onClick={handleReset}>Reset</button>
      </div>

      {/* CHART */}
      <div
        style={{
          width: "100%",
          background: "white",
          borderRadius: "12px",
          padding: "30px 25px 40px 25px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 100, // cukup biar Y-axis kanan tidak kepotong
              left: 10,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="timestamp"
              tickFormatter={formatTime}
              minTickGap={40}
            />

            <YAxis
              yAxisId="left"
              domain={[0, 55]}
              label={{ value: "RSSI", angle: -90, dx: -10 }}
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[-140, -60]}
              label={{ value: "dBm", angle: 90, dx: 10 }}
            />

            <Tooltip />
            <Legend />

            <Line yAxisId="left" dataKey="ber" stroke="#ff7300" dot={false} connectNulls />
            <Line yAxisId="right" dataKey="dbm" stroke="#82ca9d" dot={false} connectNulls />
            <Line yAxisId="left" dataKey="rssi" stroke="#8884d8" dot={false} connectNulls />
          </LineChart>
        </ResponsiveContainer>

        {/* FOOTNOTE */}
        <div style={{ marginTop: "10px", fontSize: "12px", opacity: 0.7 }}>
          ⏱ Updated every <b>{refreshInterval}</b> seconds — Last update:{" "}
          {lastUpdate ? lastUpdate.toLocaleTimeString() : "-"}
        </div>
      </div>
    </div>
  );
}
