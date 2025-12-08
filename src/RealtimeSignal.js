import React, { useEffect, useState } from "react";
import BER_TABLE from "./utils/BER_TABLE";

export default function RealtimeSignal({ apiBase }) {
  const [rssi, setRssi] = useState("-");
  const [dbm, setDbm] = useState("-");
  const [ber, setBer] = useState("-");
  const [mode, setMode] = useState("idle");

  const fetchSignal = async () => {
    try {
      const res = await fetch(`${apiBase}/signal`);
      const data = await res.json();

      setRssi(data.rssi ?? "-");
      setDbm(data.dbm ?? "-");
      setBer(data.ber ?? "-");
      setMode(data.mode ?? "idle");
    } catch (err) {
      console.error("Signal fetch error:", err);
    }
  };

  useEffect(() => {
    fetchSignal();
    const timer = setInterval(fetchSignal, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="card p-3 shadow-sm">
      <h5>📡 Realtime Signal</h5>
      <p>RSSI: {rssi}</p>
      <p>dBm: {dbm}</p>
      <p>
        BER: {ber}{" "}
        {ber !== "-" && `(${BER_TABLE[ber]})`}
      </p>

      <p>
        Mode:{" "}
        <span
          style={{
            fontWeight: "bold",
            color: mode === "dedicated" ? "red" : "green",
          }}
        >
          {mode}
        </span>
      </p>
    </div>
  );
}
