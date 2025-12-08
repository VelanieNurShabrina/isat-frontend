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
    return new Date(ts * 1000).toLocaleTimeString();
  };

  const handleFilter = () => {
    if (!startTime || !endTime) return alert("Isi start dan end time!");
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
    <div style={{ width: "100%", marginTop: 10 }}>
      <h3 style={{ marginBottom: 15 }}>Signal History (RSSI, dBm, BER)</h3>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 15 }}>
        <span>Start:</span>
        <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />

        <span>End:</span>
        <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

        <button onClick={handleFilter}>Show</button>
        <button onClick={handleReset}>Reset</button>
      </div>

      {/* CHART ONLY — NO CARD WRAPPER */}
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 80, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tickFormatter={formatTime} minTickGap={30} />
          <YAxis yAxisId="left" domain={[0, 55]} label={{ value: "RSSI", angle: -90, dx: -10 }} />
          <YAxis yAxisId="right" orientation="right" domain={[-140, -60]} label={{ value: "dBm", angle: 90, dx: 10 }} />

          <Tooltip />
          <Legend />

          <Line yAxisId="left" type="monotone" dataKey="ber" stroke="#ff7300" dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="dbm" stroke="#82ca9d" dot={false} />
          <Line yAxisId="left" type="monotone" dataKey="rssi" stroke="#8884d8" dot={false} />
        </LineChart>
      </ResponsiveContainer>

      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
        ⏱ Updated every <b>{refreshInterval}</b> seconds — Last update:{" "}
        {lastUpdate ? lastUpdate.toLocaleTimeString() : "-"}
      </div>
    </div>
  );
}
