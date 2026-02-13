import React, { useEffect, useState } from "react";

export default function SmsStats({ apiBase }) {
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    const res = await fetch(`${apiBase}/stats/sms`, {
      headers: { "ngrok-skip-browser-warning": "true" },
    });

    const json = await res.json();
    setStats(json);
  };

  useEffect(() => {
    fetchStats();
    const t = setInterval(fetchStats, 5000);
    return () => clearInterval(t);
  }, []);

  if (!stats) return null;

  return (
    <div style={card}>
      <h3>✉️ SMS Performance Today</h3>

      <div>📩 Attempt: <b>{stats.total_attempt}</b></div>
      <div>✅ Success: <b>{stats.total_success}</b></div>

      <div style={{
        marginTop: 10,
        fontSize: 22,
        fontWeight: 700,
        color: "#2563eb"
      }}>
        Success Rate: {stats.SMS_success_rate}%
      </div>
    </div>
  );
}

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  border: "1px solid #eee",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
};