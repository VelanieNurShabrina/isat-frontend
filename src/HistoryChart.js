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

  // ✅ Ambil data dari backend
  const fetchHistory = async () => {
    try {
      let url = `${apiBase}/history?limit=200`;

      // Jika user sedang filter manual
      if (isFiltered && startTime && endTime) {
        const startUnix = Math.floor(new Date(startTime).getTime() / 1000);
        const endUnix = Math.floor(new Date(endTime).getTime() / 1000);
        url = `${apiBase}/history?start=${startUnix}&end=${endUnix}&limit=200`;
      }

      const res = await fetch(url);
      const text = await res.text();

      let json;
      try {
        json = JSON.parse(text);
      } catch {
        console.error("⚠️ Response bukan JSON:", text);
        return;
      }

      if (!json.data || !Array.isArray(json.data)) {
        console.warn("⚠️ Data tidak valid:", json);
        return;
      }

      // ✅ Konversi timestamp: kurangi 7 jam (karena Raspberry kirim WIB)
      const mapped = json.data.map((d) => ({
        time: new Date((d.timestamp - 25200) * 1000), // 25200 detik = 7 jam
        rssi: d.rssi,
        dbm: d.dbm,
      }));

      setData([...mapped]); // paksa render ulang
      setLastUpdate(new Date());
      console.log("✅ Data history:", mapped.length, "entri");
    } catch (e) {
      console.error("❌ Gagal fetch history:", e);
    }
  };

  // ✅ Auto-refresh tiap interval (selalu jalan, tidak tergantung filter)
  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  // ✅ Format waktu WIB
  const timeFormatter = (time) =>
    new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    }).format(time);

  // ✅ Tombol filter manual
  const handleFilter = async () => {
    if (startTime && endTime) {
      setIsFiltered(true);
      await fetchHistory();
    }
  };

  // ✅ Reset filter
  const handleReset = async () => {
    setIsFiltered(false);
    setStartTime("");
    setEndTime("");
    await fetchHistory();
  };

  return (
    <div style={{ width: "100%", height: 400, marginTop: 20 }}>
      <h3 style={{ fontWeight: "600", marginBottom: 10 }}>
        Signal History (RSSI and dBm)
      </h3>

      {/* Filter manual */}
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

      {/* Chart utama */}
      <ResponsiveContainer width="100%" height={400} key={lastUpdate}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 50, left: 0, bottom: 5 }}
        >
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
            allowDataOverflow={true}
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
            labelFormatter={(label) => `Time: ${timeFormatter(label)}`}
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
