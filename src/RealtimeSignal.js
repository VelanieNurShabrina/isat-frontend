import React, { useEffect, useState } from "react";

// Mapping BER index (0–15) ke rentang persen sesuai tabel Pak Eko (GMR2P)
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

function formatBer(berIndex) {
  if (
    berIndex === null ||
    berIndex === undefined ||
    berIndex === "-" ||
    Number.isNaN(Number(berIndex))
  ) {
    return "-";
  }
  const idx = Number(berIndex);
  return BER_TABLE[idx] || `Index ${berIndex}`;
}

export default function RealtimeSignal({ apiBase }) {
  const [signal, setSignal] = useState({ rssi: "-", dbm: "-", ber: "-" });
  const [source, setSource] = useState("Mini PC");

  const fetchSignal = async () => {
    try {
      // 🔹 1️⃣ Coba ambil sinyal langsung dari Raspberry Pi
      const res = await fetch(`${apiBase}/signal`);
      const json = await res.json();

      if (json && json.rssi !== undefined) {
        setSignal(json);
        setSource("Mini PC");
        console.log("📡 Realtime from Mini PC:", json);
        return;
      }
    } catch (e) {
      console.warn("⚠️ Failed to fetch from Pi, try fetching from Railway...");
    }

    // 🔹 2️⃣ Kalau gagal, ambil data terbaru dari Railway (fallback)
    try {
      const cloudRes = await fetch(
        "https://isat-backend-production.up.railway.app/history?limit=1"
      );
      const cloudJson = await cloudRes.json();
      const latest = cloudJson.data[cloudJson.data.length - 1];

      if (latest) {
        setSignal(latest);
        setSource("Cloud (Railway)");
        console.log("☁️ Fallback ke Railway:", latest);
      }
    } catch (err) {
      console.error("❌ Failed to fetch signal from cloud:", err);
    }
  };

  // 🔁 Ambil data tiap 2 detik
  useEffect(() => {
    fetchSignal();
    const interval = setInterval(fetchSignal, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 10,
        padding: 15,
        width: 260,
        backgroundColor: "#fafafa",
      }}
    >
      <h4>📶 Realtime Signal</h4>
      <p>
        <strong>RSSI:</strong> {signal.rssi}
      </p>
      <p>
        <strong>dBm:</strong> {signal.dbm}
      </p>
      <p>
        <strong>BER:</strong> {signal.ber}{" "}
        <span style={{ fontSize: 12, color: "#555" }}>
          ({formatBer(signal.ber)})
        </span>
      </p>

      <p style={{ fontSize: 12, color: "#777" }}>📍Source: {source}</p>
    </div>
  );
}
