import React, { useEffect, useState } from "react";

export default function CallLogTable({ apiBase }) {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    const res = await fetch(`${apiBase}/logs/call`, {
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
    <div style={card}>
      <h3>📋 Call Logs</h3>

      <table width="100%">
        <thead>
          <tr>
            <th>Time</th>
            <th>Number</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((l, i) => (
            <tr key={i}>
              <td>
                {new Date(l.time * 1000).toLocaleTimeString()}
              </td>

              <td>{l.number}</td>

              <td style={{
                color: l.status === "success"
                  ? "green"
                  : "red"
              }}>
                {l.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  border: "1px solid #eee",
  marginTop: 20,
};
