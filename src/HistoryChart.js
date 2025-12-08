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
import BER_TABLE from "./utils/BER_TABLE";

export default function HistoryChart({ apiBase }) {
  const [data, setData] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${apiBase}/history?limit=300`);
      const json = await res.json();

      setData(
        json.data.map((d) => ({
          timestamp: new Date(d.timestamp * 1000).toLocaleTimeString(),
          rssi: d.rssi,
          dbm: d.dbm,
          ber: d.ber,
        }))
      );
    } catch (err) {
      console.error("History fetch error:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
    const timer = setInterval(fetchHistory, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mt-4">
      <h5>Signal History (RSSI, dBm, BER)</h5>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="timestamp" />
          <YAxis yAxisId="left" domain={[0, 55]} />
          <YAxis yAxisId="right" orientation="right" domain={[-140, -60]} />

          <Tooltip
            formatter={(value, name) => {
              if (name === "ber") {
                return [`${value} (${BER_TABLE[value]})`, "BER"];
              }
              return [value, name];
            }}
          />

          <Legend />

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="rssi"
            stroke="#8884d8"
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="dbm"
            stroke="#82ca9d"
            dot={false}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="ber"
            stroke="#ff7300"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
