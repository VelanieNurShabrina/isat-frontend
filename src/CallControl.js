import React, { useState } from "react";

export default function CallControl({ apiBase }) {
  const [number, setNumber] = useState("+870772001899");
  const [callSeconds, setCallSeconds] = useState(15);
  const [statusMsg, setStatusMsg] = useState("");

  const [calling, setCalling] = useState(false);
  const [stopping, setStopping] = useState(false);

  const handleCall = async () => {
    setCalling(true);
    setStatusMsg("📞 Calling Number...");

    try {
      const res = await fetch(
        `${apiBase}/call?number=${encodeURIComponent(
          number
        )}&secs=${callSeconds}`
      );
      const data = await res.json();

      if (data.status === "ok") {
        setStatusMsg(
          `📞 Calling ${data.number} for ${data.call_seconds} seconds`
        );
      } else {
        setStatusMsg(
          `⚠️ Failed to make call: ${data.msg || "Unknown"}`
        );
      }
    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Unable to connect (check tunnel).");
    } finally {
      setCalling(false);
    }
  };

  const handleStop = async () => {
    setStopping(true);
    setStatusMsg("🛑 End the call...");

    try {
      const res = await fetch(`${apiBase}/call/stop`, {
        method: "POST",
      });

      await res.json();

      setStatusMsg("🛑 Call terminated");
    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Failed to stop call");
    } finally {
      setStopping(false);
    }
  };

  return (
    <div
      style={{
        marginBottom: 30,
        padding: "15px",
        border: "1px solid #ccc",
        borderRadius: 8,
        backgroundColor: "#fafafa",
        display: "inline-block",
      }}
    >
      <h4>📞 Call Control</h4>

      <div style={{ marginBottom: 10 }}>
        <label style={{ fontWeight: 500 }}>Number:</label>
        <input
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          style={{
            marginLeft: 10,
            padding: "5px",
            borderRadius: 6,
            border: "1px solid #ccc",
            width: "200px",
          }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ fontWeight: 500 }}>Duration (s):</label>
        <input
          type="number"
          min="1"
          max="300"
          value={callSeconds}
          onChange={(e) => setCallSeconds(e.target.value)}
          style={{
            marginLeft: 10,
            padding: "5px",
            borderRadius: 6,
            border: "1px solid #ccc",
            width: "80px",
          }}
        />
      </div>

      <button
        onClick={handleCall}
        disabled={calling} // hanya tombol CALL yang disable
        style={{
          padding: "6px 12px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: 6,
          marginRight: 10,
          cursor: calling ? "not-allowed" : "pointer",
        }}
      >
        Call
      </button>

      <button
        onClick={handleStop}
        disabled={stopping} // STOP hanya disable saat stop sedang proses
        style={{
          padding: "6px 12px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: stopping ? "not-allowed" : "pointer",
        }}
      >
        Stop
      </button>

      {statusMsg && (
        <p style={{ marginTop: 10, fontSize: 14, color: "#333" }}>
          {statusMsg}
        </p>
      )}
    </div>
  );
}
