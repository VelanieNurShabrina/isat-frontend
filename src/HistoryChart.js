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

  // === FETCH HISTORY ===
  const fetchHistory = async () => {
    try {
      let url = `${apiBase}/history?limit=300`;

      if (isFiltered && startTime && endTime) {
        const startUnix = Math.floor(new Date(startTime).getTime() / 1000);
        const endUnix = Math.floor(new Date(endTime).getTime() / 1000);
        url = `${apiBase}/history?start=${startUnix}&end=${endUnix}&limit=500`;
      }

      const res = await fetch(url);
      const json = await res.json();

      if (!json.data || !Array.isArray(json.data)) return;

      // Sort by timestamp ascending
      const sorted = [...json.data].sort((a, b) => a.timestamp - b.timestamp);

      // Convert timestamp → ms for X-axis
      const mapped = sorted.map((d) => ({
        time: d.timestamp * 1000, // milliseconds
        rssi: d.rssi,
        dbm: d.dbm,
      }));

      const latest = mapped.slice(-200);
      setData(latest);
      setLastUpdate(new Date());

      console.log(
        "✅ Data updated:",
        latest.length,
        "entries. Latest at:",
        new Date(latest[latest.length - 1]?.time).toLocaleTimeString("id-ID", {
          hour12: false,
        })
      );
    } catch (e) {
      console.error("❌ Gagal fetch history:", e);
    }
  };

  // === AUTO REFRESH ===
  useEffect(() => {
    fetchHistory();
    if (!isFiltered) {
      const interval = setInterval(fetchHistory, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, isFiltered]);

  // === TIME FORMATTER ===
  const timeFormatter = (ms) =>
    new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    }).format(new Date(ms));

  // === FILTER HANDLERS ===
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
      <h3 style={{ fontWeight: 600, marginBottom: 10 }}>
        Signal History (RSSI and dBm)
      </h3>

      {/* FILTER INPUT */}
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
        <button onClick={handleFilter} style={{ padding: "6px 10px" }}>
          Show
        </button>
        <button onClick={handleReset} style={{ padding: "6px 10px" }}>
          Reset
        </button>
      </div>

      {/* === CHART === */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 10, right: 50, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />

          <XAxis
            dataKey="time"
            tickFormatter={timeFormatter}
            stroke="#666"
            minTickGap={60}
            type="number"
            domain={["auto", "auto"]}
          />

          <YAxis
            yAxisId="left"
            domain={[0, 55]}
            label={{
              value: "RSSI (bars)",
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
              value: "dBm (signal strength)",
              angle: 90,
              position: "insideRight",
            }}
            stroke="#82ca9d"
          />

          <Tooltip
            formatter={(value, name) => {
              if (name === "rssi") return [`${value}`, "RSSI"];
              if (name === "dbm") return [`${value} dBm`, "dBm"];
              return [value, name];
            }}
            labelFormatter={(ms) => `Time: ${timeFormatter(ms)}`}
          />

          <Legend verticalAlign="top" height={36} />

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="rssi"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
            name="RSSI"
          />

          <Line
            yAxisId="right"
            type="monotone"
            dataKey="dbm"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={false}
            name="dBm"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* FOOTER */}
      {lastUpdate && (
        <p style={{ fontSize: 12, color: "#777", marginTop: 10 }}>
          {isFiltered
            ? "⏱️ Showing filtered data (no auto-refresh)"
            : `⏱️ Updated every ${refreshInterval} seconds — Last update (WIB): ${lastUpdate.toLocaleTimeString(
                "id-ID",
                { hour12: false }
              )}`}
        </p>
      )}
    </div>
  );
}
