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

  // ===============================
  // Fetch History
  // ===============================
  const fetchHistory = async () => {
    try {
      let url = `${apiBase}/history?limit=500`;

      if (isFiltered && startTime && endTime) {
        const startUnix = Math.floor(new Date(startTime).getTime() / 1000);
        const endUnix = Math.floor(new Date(endTime).getTime() / 1000);
        url += `&start=${startUnix}&end=${endUnix}`;
      }

      const res = await fetch(url);
      const json = await res.json();

      if (json.data) {
        const formatted = json.data.map((row) => ({
          timestamp: row.timestamp * 1000, 
          timeLabel: new Date(row.timestamp * 1000).toLocaleTimeString(), // untuk tooltip

          // removed RSSI raw 
          dbm: row.dbm,
          ber: row.ber,
        }));

        setData(formatted);
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

  // ===============================
  // Filter Submit
  // ===============================
  const handleFilter = () => {
    if (!startTime || !endTime) {
      alert("Fill start and end time!");
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
    <div style={{ width: "100%", marginTop: "20px" }}>
      <div style={{ marginBottom: 16 }}>
        <h3
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#111",
          }}
        >
          📈 Signal History (dBm & BER)
        </h3>

        <div
          style={{
            width: 56,
            height: 3,
            background: "#16a34a", 
            borderRadius: 2,
            marginTop: 6,
          }}
        />
      </div>

      {/* FILTER BAR */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "10px",
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
          borderRadius: "10px",
          padding: "10px 10px 25px 10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 80,
              left: 60,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            {/* TIME SERIES */}
            <XAxis
              dataKey="timestamp"
              type="number"
              scale="time"
              domain={["auto", "auto"]}
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              minTickGap={50}
            />

            {/* Y AXIS LEFT → DBM */}
            <YAxis
              yAxisId="left"
              domain={[-140, -60]}
              tick={{ fill: "#111", fontSize: 12 }} // ⬅️ scale
              label={{
                value: "RSSI (dBm)",
                angle: -90,
                position: "insideLeft",
                fill: "#4CAF50", 
                fontSize: 14,
                fontWeight: 600,
                dx: -20, 
              }}
            />

            {/* Y AXIS RIGHT → BER */}
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 15]}
              ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]}
              tick={{ fill: "#111", fontSize: 12 }} 
              label={{
                value: "BER (Index)",
                angle: 90,
                position: "insideRight",
                fill: "#ff8c00", // 
                fontSize: 14, //
                fontWeight: 600,
                dx: 20, // 
              }}
            />

            {/* Tooltip */}
            <Tooltip
              labelFormatter={(value) => new Date(value).toLocaleTimeString()}
            />

            <Legend />

            {/* BER */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="ber"
              name="BER"
              stroke="#ff8c00"
              dot={false}
              connectNulls
            />

            {/* dBm */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="dbm"
              name="RSSI (dBm)"
              stroke="#4CAF50"
              dot={false}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>

        <div style={{ marginTop: "10px", fontSize: "12px", opacity: 0.7 }}>
          Updated — Last update:{" "}
          {lastUpdate ? lastUpdate.toLocaleTimeString() : "-"}
        </div>
      </div>
    </div>
  );
}
