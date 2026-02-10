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
        padding: "16px",
        borderRadius: "10px",
        border: "1px solid #f1f5f9",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          fontWeight: "700",
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: "24px",
          fontWeight: "800",
          color: accent,
          margin: "4px 0",
          fontFamily: "monospace",
        }}
      >
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "500" }}>
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
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Container Grid buat Card */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "16px",
        }}
      >
        <StatCard
          title="RSSI Raw"
          value={signal.rssi}
          subtitle="Signal Index"
          accent="#6366f1"
        />
        <StatCard
          title="Signal Strength"
          value={`${signal.dbm} dBm`}
          subtitle="Power Level"
          accent="#10b981"
        />
        <StatCard
          title="Error Rate (BER)"
          value={signal.ber}
          subtitle={berText}
          accent="#f59e0b"
        />
      </div>
    </div>
  );
}
