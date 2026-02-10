import React, { useEffect, useState } from "react";

export default function SidebarSignal({ apiBase }) {
  const [sig, setSig] = useState({
    rssi: "-",
    dbm: "-",
    ber: "-"
  });

  useEffect(() => {
    const fetchSig = async () => {
      try {
        const res = await fetch(`${apiBase}/signal`, {
          headers: { "ngrok-skip-browser-warning": "true" }
        });
        const j = await res.json();
        setSig(j);
      } catch {}
    };

    fetchSig();
    const t = setInterval(fetchSig, 2000);
    return () => clearInterval(t);
  }, [apiBase]);

  return (
    <div style={{
      background: "#f9fafb",
      border: "1px solid #e5e7eb",
      borderRadius: 8,
      padding: 12,
      fontSize: 13
    }}>
      <table style={{ width: "100%", textAlign: "center" }}>
        <thead>
          <tr style={{ color: "#6b7280", fontSize: 11 }}>
            <th>RSSI</th>
            <th>dBm</th>
            <th>BER</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ fontWeight: 700, fontSize: 15 }}>
            <td>{sig.rssi}</td>
            <td style={{ color: "#16a34a" }}>{sig.dbm}</td>
            <td style={{
              color: sig.ber > 5 ? "#dc2626" : "#f59e0b"
            }}>
              {sig.ber}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
