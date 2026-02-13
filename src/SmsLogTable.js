import React, { useEffect, useState } from "react";

export default function SmsLogTable({ apiBase }) {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    const res = await fetch(`${apiBase}/logs/sms`, {
      headers: { "ngrok-skip-browser-warning": "true" },
    });

    const json = await res.json();
    setLogs(json);
  };

  useEffect(() => {
    fetchLogs();
    const t = setInterval(fetchLogs, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #f1f5f9", textAlign: "left" }}>
            <th style={th}>TIME</th>
            <th style={th}>NUMBER</th>
            <th style={th}>STATUS</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((l, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={td}>
                {new Date(l.time * 1000).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>

              <td style={{ padding: "12px 8px", fontWeight: "500" }}>
                {l.number}
              </td>

              <td style={{ padding: "12px 8px" }}>
                <span style={{
                  padding: "4px 8px",
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  background: l.status === "success" ? "#dbeafe" : "#fee2e2",
                  color: l.status === "success" ? "#1d4ed8" : "#991b1b",
                }}>
                  {l.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = { padding: "12px 8px", color: "#64748b", fontWeight: 600 };
const td = { padding: "12px 8px", fontFamily: "monospace" };