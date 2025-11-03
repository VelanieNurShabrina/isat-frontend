import React, { useEffect, useState } from "react";

export default function RealtimeSignal({ apiBase }) {
  const [signal, setSignal] = useState({ rssi: 0, dbm: 0, ber: 0 });

  const fetchSignal = async () => {
    try {
      const res = await fetch(`${apiBase}/signal`);
      const json = await res.json();
      setSignal(json);
    } catch (e) {
      console.error("Failed to fetch signal:", e);
    }
  };

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
        width: 250,
        backgroundColor: "#fafafa",
      }}
    >
      <h4>📶 Realtime Signal</h4>
      <p><strong>RSSI:</strong> {signal.rssi}</p>
      <p><strong>dBm:</strong> {signal.dbm}</p>
      <p><strong>BER:</strong> {signal.ber}</p>
    </div>
  );
}
