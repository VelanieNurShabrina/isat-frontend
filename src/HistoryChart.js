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
      let url = `${apiBase}/history?limit=200`;

      if (isFiltered && startTime && endTime) {
        const startUnix = Math.floor(new Date(startTime).getTime() / 1000);
        const endUnix = Math.floor(new Date(endTime).getTime() / 1000);
        url = `${apiBase}/history?start=${startUnix}&end=${endUnix}&limit=200`;
      }

      const res = await fetch(url);
      const json = await res.json();

      const mapped = json.data.map((d) => ({
        time: new Date(d.timestamp * 1000),
        rssi: d.rssi,
        dbm: d.dbm,
      }));

      setData(mapped);
      setLastUpdate(new Date());
    } catch (e) {
      console.error("Failed to fetch history:", e);
    }
  };

  useEffect(() => {
    if (!isFiltered) {
      fetchHistory();
      const interval = setInterval(fetchHistory, refreshInterval * 1000);
      return () => clearInterval(interval);
    } else {
      fetchHistory();
    }
  }, [refreshInterval, isFiltered, startTime, endTime]);

  const timeFormatter = (time) =>
    new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
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
          Start time:{" "}
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>
        <label>
          End time:{" "}
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>
        <button
          onClick={handleFilter}
          style={{
            background: "#007bff",
            color: "white",
            border: "none",
            padding: "6px 10px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Show
        </button>
        <button
          onClick={handleReset}
          style={{
            background: "#aaa",
            color: "white",
            border: "none",
            padding: "6px 10px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 10, right: 50, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="time"
            tickFormatter={timeFormatter}
            stroke="#666"
            minTickGap={60}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            yAxisId="left"
            domain={[0, 55]}
            label={{
              value: "RSSI (bars)",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle", fill: "#555", fontSize: 12 },
            }}
            stroke="#8884d8"
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[-140, -100]}
            label={{
              value: "dBm (signal strength)",
              angle: 90,
              position: "insideRight",
              style: { textAnchor: "middle", fill: "#555", fontSize: 12 },
            }}
            stroke="#82ca9d"
          />
          <Tooltip
            formatter={(value, name) => {
              if (name === "rssi") return [`${value}`, "RSSI"];
              if (name === "dbm") return [`${value} dBm`, "dBm"];
              return [value, name];
            }}
            labelFormatter={(label) => `Time: ${timeFormatter(label)}`}
            contentStyle={{
              backgroundColor: "white",
              borderRadius: 8,
              border: "1px solid #ddd",
              fontSize: 12,
            }}
          />
          <Legend verticalAlign="top" height={36} />
          <Line yAxisId="left" type="monotone" dataKey="rssi" stroke="#8884d8" strokeWidth={2} dot={false} name="RSSI" activeDot={{ r: 4 }} />
          <Line yAxisId="right" type="monotone" dataKey="dbm" stroke="#82ca9d" strokeWidth={2} dot={false} name="dBm" activeDot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>

      {lastUpdate && (
        <p style={{ fontSize: 12, color: "#777", marginTop: 10 }}>
          {isFiltered
            ? "⏱️ Showing filtered data (no auto-refresh)"
            : `⏱️ Updated every ${refreshInterval} seconds — Last update: ${lastUpdate.toLocaleTimeString()}`}
        </p>
      )}
    </div>
  );
}
