import React, { useEffect, useState } from "react";

export default function RealtimeSignal({ apiBase }) {
  const [signal, setSignal] = useState({ rssi: "-", dbm: "-", ber: "-" });
  const [source, setSource] = useState("Local (Pi)");

  const fetchSignal = async () => {
    try {
      // 🔹 1️⃣ Coba ambil sinyal langsung dari Raspberry Pi
      const res = await fetch(`${apiBase}/signal`);
      const json = await res.json();

      if (json && json.rssi !== undefined) {
        setSignal(json);
        setSource("Local (Pi)");
        console.log("📡 Realtime dari Raspberry Pi:", json);
        return;
      }
    } catch (e) {
      console.warn("⚠️ Gagal fetch dari Pi, coba ambil dari Railway...");
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
      console.error("❌ Gagal fetch signal dari cloud:", err);
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
      <p><strong>RSSI:</strong> {signal.rssi}</p>
      <p><strong>dBm:</strong> {signal.dbm}</p>
      <p><strong>BER:</strong> {signal.ber}</p>
      <p style={{ fontSize: 12, color: "#777" }}>📍Source: {source}</p>
    </div>
  );
}
