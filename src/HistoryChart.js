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

export default function HistoryChart({ apiBase }) {
  const [data, setData] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);

  // ==== FETCH HISTORY ====
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

      const formatted =
        json.data?.map((row) => ({
          timestamp: new Date(row.timestamp * 1000).toLocaleTimeString(),
          dbm: row.dbm,
          ber: row.ber,
        })) || [];

      setData(formatted);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 10000);
    return () => clearInterval(interval);
  }, []);

  const applyFilter = () => {
    if (!startTime || !endTime) return;
    setIsFiltered(true);
    fetchHistory();
  };

  const resetFilter = () => {
    setIsFiltered(false);
    setStartTime("");
    setEndTime("");
    fetchHistory();
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h3>Signal History (dBm & BER)</h3>

      <div style={{ marginBottom: 10 }}>
        Start:
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          style={{ marginRight: 10, marginLeft: 5 }}
        />
        End:
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          style={{ marginLeft: 5, marginRight: 10 }}
        />

        <button onClick={applyFilter}>Show</button>
        <button onClick={resetFilter} style={{ marginLeft: 5 }}>
          Reset
        </button>
      </div>

      {/* ==== CHART ==== */}
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="timestamp" />

          {/* LEFT AXIS (dBm) */}
          <YAxis
            yAxisId="left"
            label={{ value: "dBm", angle: -90, position: "insideLeft" }}
            domain={[-140, -60]}
          />

          {/* RIGHT AXIS (BER) */}
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: "BER", angle: 90, position: "insideRight" }}
            domain={[0, 10]}
          />

          <Tooltip />
          <Legend />

          {/* === dBm LINE === */}
          <Line
            type="monotone"
            yAxisId="left"
            dataKey="dbm"
            stroke="#4CAF50"
            dot={false}
            name="dBm"
          />

          {/* === BER LINE === */}
          <Line
            type="monotone"
            yAxisId="right"
            dataKey="ber"
            stroke="#FF9800"
            dot={false}
            name="BER"
          />
        </LineChart>
      </ResponsiveContainer>

      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.6 }}>
        Updated {lastUpdate ? `— Last update: ${lastUpdate}` : ""}
      </div>
    </div>
  );
}
