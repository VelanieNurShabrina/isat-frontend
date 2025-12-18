// src/RealtimeSignal.js
import React, { useEffect, useState } from "react";

// Mapping BER index 0–15 ke teks persentase (sesuai tabel Pak Eko)
const BER_TABLE = {
  15: "11,9% < BER",
  14: "10,5% < BER < 11,9%",
  13: "9,1% < BER < 10,5%",
  12: "7,9% < BER < 9,1%",
  11: "6,6% < BER < 7,9%",
  10: "5,6% < BER < 6,6%",
  9: "4,6% < BER < 5,6%",
  8: "3,7% < BER < 4,6%",
  7: "2,9% < BER < 3,7%",
  6: "2,1% < BER < 2,9%",
  5: "1,4% < BER < 2,1%",
  4: "0,9% < BER < 1,4%",
  3: "0,5% < BER < 0,9%",
  2: "0,2% < BER < 0,5%",
  1: "0,05% < BER < 0,2%",
  0: "BER < 0,05%",
};

function StatCard({ title, value, subtitle, color = "#222" }) {
  return (
    <div
      style={{
        flex: 1,
        background: "#f9fafb",
        padding: "14px 16px",
        borderRadius: "10px",
        border: "1px solid #eee",
      }}
    >
      <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
        {title}
      </div>
      <div style={{ fontSize: 26, fontWeight: 600, color }}>{value}</div>
      {subtitle && (
        <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

export default function RealtimeSignal({ apiBase }) {
  const [signal, setSignal] = useState({
    rssi: "-",
    dbm: "-",
    ber: "-",
  });
  const [mode, setMode] = useState("idle");
  const [source, setSource] = useState("Mini PC");

  const berText =
    typeof signal.ber === "number" && BER_TABLE.hasOwnProperty(signal.ber)
      ? BER_TABLE[signal.ber]
      : signal.ber;

  const fetchSignal = async () => {
    try {
      const res = await fetch(`${apiBase}/signal`);
      const json = await res.json();

      if (json && json.rssi !== undefined) {
        setSignal({
          rssi: json.rssi,
          dbm: json.dbm,
          ber: json.ber,
        });
        setMode(json.mode || "idle");
        setSource("Mini PC");
        // console.log("Realtime from backend:", json);
      }
    } catch (e) {
      console.error("Failed to fetch realtime signal:", e);
    }
  };

  useEffect(() => {
    fetchSignal();
    const t = setInterval(fetchSignal, 2000); // 2 detik
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      <h4 style={{ marginBottom: 12 }}>📶 Realtime Signal</h4>

      {/* STAT CARDS */}
      <div style={{ display: "flex", gap: 12 }}>
        <StatCard title="RSSI" value={signal.rssi} subtitle="bars" />

        <StatCard title="Signal Power" value={signal.dbm} subtitle="dBm" />

        <StatCard title="BER" value={signal.ber} subtitle={berText} />
      </div>

      {/* MODE & SOURCE */}
      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 13 }}>
          <strong>Mode:</strong> {mode}
        </div>
        <div style={{ fontSize: 12, color: "#777" }}>📍 Source: {source}</div>
      </div>
    </div>
  );
}
