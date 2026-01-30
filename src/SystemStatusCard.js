import React from "react";

export default function SystemStatusCard({ status }) {
  if (!status) return null;

  const { current_task, queue_length, call_active } = status;

  let activityText = "🟢 System Idle";

  if (current_task?.type) {
    const src = current_task.source === "auto" ? "AUTO" : "MANUAL";
    activityText =
      current_task.type === "CALL"
        ? `📞 ${src} CALL running`
        : `📩 ${src} SMS processing`;
  }

  return (
    <div
      style={{
        background: "#fff",
        padding: "16px",
        borderRadius: 12,
        border: "1px solid #eee",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        maxWidth: 420,
      }}
    >
      <h3 style={{ margin: 0, fontSize: 18 }}>⚙️ System Status</h3>

      <div style={{ marginTop: 10, fontSize: 14 }}>
        <div>{activityText}</div>

        <div style={{ marginTop: 6 }}>
          ⏳ Queue waiting: <b>{queue_length}</b>
        </div>

        <div style={{ marginTop: 6 }}>
          📡 Call mode:{" "}
          <b>{call_active ? "Dedicated" : "Idle"}</b>
        </div>
      </div>
    </div>
  );
}
