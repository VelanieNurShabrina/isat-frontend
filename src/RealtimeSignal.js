// src/RealtimeSignal.js
import React, { useEffect, useState } from "react";

// Mapping BER index 0–15 ke teks persentase
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

function StatCard({ title, value, subtitle, accent = "#2563eb" }) {
  return (
    <div
      style={{
        flex: 1,
        background: "#fff",
        padding: "14px 16px",
        borderRadius: "12px",
        border: "1px solid #eee",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ fontSize: 12, color: "#666" }}>{title}</div>

      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: accent,
          marginTop: 4,
        }}
      >
        {value}
      </div>

      {subtitle && (
        <div style={{ fontSize: 11, color: "#888" }}>{subtitle}</div>
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
      const res = await fetch(`${apiBase}/signal`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      const json = await res.json();

      if (json && json.rssi !== undefined) {
        setSignal({
          rssi: json.rssi,
          dbm: json.dbm,
          ber: json.ber,
        });
        setMode(json.mode || "idle");
        setSource("Mini PC");
      }
    } catch (e) {
      console.error("Failed to fetch realtime signal:", e);
    }
  };

  useEffect(() => {
    fetchSignal();
    const t = setInterval(fetchSignal, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      {/* SECTION HEADER */}
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
          📶 Realtime Signal
        </h3>

        <div
          style={{
            width: 48,
            height: 3,
            background: "#2563eb",
            borderRadius: 2,
            marginTop: 6,
          }}
        />
      </div>

      {/* STAT CARDS */}
      <div style={{ display: "flex", gap: 12 }}>
        <StatCard
          title="RSSI"
          value={signal.rssi}
          subtitle="bars"
          accent="#2563eb"
        />

        <StatCard
          title="Signal Power"
          value={signal.dbm}
          subtitle="dBm"
          accent="#16a34a"
        />

        <StatCard
          title="BER"
          value={signal.ber}
          subtitle={berText}
          accent={signal.ber > 5 ? "#dc2626" : "#f59e0b"}
        />
      </div>

      {/* MODE & SOURCE */}
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <span
          style={{
            padding: "4px 10px",
            borderRadius: 20,
            fontSize: 12,
            background: mode === "idle" ? "#e0f2fe" : "#fee2e2",
            color: mode === "idle" ? "#0369a1" : "#991b1b",
            fontWeight: 500,
          }}
        >
          {mode.toUpperCase()}
        </span>

        <span style={{ fontSize: 12, color: "#777" }}>📍 {source}</span>
      </div>
    </div>
  );
}
