import React, { useState } from "react";

export default function IntervalControl({ apiBase, onIntervalChange }) {
  const [interval, setIntervalValue] = useState(10);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleChange = async (e) => {
    const newInterval = parseInt(e.target.value);

    setIntervalValue(newInterval);
    setLoading(true);
    setStatusMsg("⏳ Changing intervals...");

    try {
      const res = await fetch(
        `${apiBase}/config/interval?interval=${newInterval}`,
        { method: "GET" }
      );

      const json = await res.json();

      if (json.status === "ok") {
        setStatusMsg(`✅ The interval was successfully changed to ${newInterval} seconds`);
        if (onIntervalChange) onIntervalChange(newInterval);
      } else {
        setStatusMsg(
          `⚠️ Failed to change interval: ${
            json.msg || json.message || "Unknown"
          }`
        );
      }
    } catch (err) {
      console.error("❌ Failed to connect to Mini PC:", err);
      setStatusMsg("❌ Cannot connect to Mini PC (check tunnel).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f9f9f9",
        padding: "10px 14px",
        borderRadius: 8,
        border: "1px solid #ddd",
        width: "100%",
        boxSizing: "border-box",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      }}
    >
      <label
        style={{
          fontWeight: 600,
          marginBottom: 6,
          display: "block",
          fontSize: 14,
        }}
      >
        ⏱️ Signal Reading Interval:
      </label>

      <select
        value={interval}
        onChange={handleChange}
        disabled={loading}
        style={{
          padding: "6px 10px",
          borderRadius: 6,
          border: "1px solid #ccc",
          fontSize: 14,
          cursor: loading ? "not-allowed" : "pointer",
          width: "100%",
        }}
      >
        <option value="5">5 Seconds</option>
        <option value="10">10 Seconds</option>
        <option value="20">20 Seconds</option>
        <option value="30">30 Seconds</option>
        <option value="60">60 Seconds</option>
      </select>

      {statusMsg && (
        <p
          style={{
            fontSize: 13,
            marginTop: 8,
            color: statusMsg.startsWith("✅")
              ? "green"
              : statusMsg.startsWith("⚠️")
              ? "#d67b00"
              : statusMsg.startsWith("❌")
              ? "red"
              : "#333",
          }}
        >
          {statusMsg}
        </p>
      )}
    </div>
  );
}
