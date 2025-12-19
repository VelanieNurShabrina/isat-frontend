// src/IntervalControl.js
import React, { useState } from "react";

export default function IntervalControl({ apiBase, interval, onIntervalChange }) {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleChange = async (e) => {
    const newInterval = parseInt(e.target.value, 10);
    if (Number.isNaN(newInterval)) return;

    onIntervalChange(newInterval);

    setLoading(true);
    setStatusMsg("⏳ Changing interval...");

    try {
      const res = await fetch(
        `${apiBase}/config/interval?interval=${newInterval}`,
        { method: "GET" }
      );
      const json = await res.json();

      if (json.status === "ok") {
        setStatusMsg(`✅ Interval set to ${newInterval} seconds`);
      } else {
        setStatusMsg(`⚠️ Failed to change interval`);
      }
    } catch (err) {
      setStatusMsg("❌ Cannot connect to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ===== HEADER ===== */}
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
          ⏱️ Signal Reading Interval
        </h3>

        <div
          style={{
            width: 48,
            height: 3,
            background: "#7c3aed", // ungu biar beda dari card lain
            borderRadius: 2,
            marginTop: 6,
          }}
        />
      </div>

      {/* ===== CONTENT ===== */}
      <select
        value={interval}
        onChange={handleChange}
        disabled={loading}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 8,
          border: "1px solid #ccc",
          fontSize: 14,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        <option value={5}>5 Seconds</option>
        <option value={10}>10 Seconds</option>
        <option value={20}>20 Seconds</option>
        <option value={30}>30 Seconds</option>
        <option value={60}>60 Seconds</option>
      </select>

      {statusMsg && (
        <div
          style={{
            marginTop: 10,
            fontSize: 13,
            color: statusMsg.startsWith("✅")
              ? "#15803d"
              : statusMsg.startsWith("⚠️")
              ? "#b45309"
              : "#b91c1c",
          }}
        >
          {statusMsg}
        </div>
      )}
    </div>
  );
}
