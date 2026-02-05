import React, { useState, useEffect, useRef } from "react";

export default function CallControl({
  apiBase,
  isCalling,
  autoCallRunning,
  onCallStateChange,
}) {
  const [number, setNumber] = useState("");
  const [callSeconds, setCallSeconds] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [stopping, setStopping] = useState(false);

  const wasCallingRef = useRef(false);

  // =========================
  const resetForm = () => {
    setNumber("");
    setCallSeconds("");
  };

  // =========================
  // Poll backend
  // =========================
  useEffect(() => {
    const poll = setInterval(async () => {
      try {
        const res = await fetch(`${apiBase}/status`, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });

        const data = await res.json();

        const isManualCall =
          data.call_active &&
          data.current_task?.type === "CALL" &&
          data.current_task?.source === "manual";

        onCallStateChange(isManualCall);

        // =========================
        // RESTORE FORM SAAT CALLING
        // =========================
        if (isManualCall) {
          wasCallingRef.current = true;

          setNumber(data.last_manual_call?.number || "");
          setCallSeconds(data.last_manual_call?.duration || "");

          setStatusMsg(
            `📞 Calling ${data.last_manual_call?.number || ""} (waiting for connection…)`
          );
          return;
        }

        // =========================
        // CALL BARU SAJA SELESAI
        // =========================
        if (!data.call_active && wasCallingRef.current) {
          wasCallingRef.current = false;

          resetForm();

          if (data.call_state === "timeout") {
            setStatusMsg("⏱️ Call timeout");
          } else if (data.call_state === "stopped_by_user") {
            setStatusMsg("🛑 Stopped by user");
          } else if (data.call_state === "rejected") {
            setStatusMsg("❌ Call rejected");
          } else {
            setStatusMsg("Idle");
          }
        }

      } catch {}
    }, 1000);

    return () => clearInterval(poll);
  }, [apiBase]);

  // =========================
  const handleCall = async () => {
    if (autoCallRunning) return;

    if (!number || !callSeconds) {
      setStatusMsg("⚠️ Number & duration required");
      return;
    }

    setStatusMsg(`📞 Calling ${number}...`);

    await fetch(
      `${apiBase}/call?number=${encodeURIComponent(number)}&secs=${callSeconds}`,
      { headers: { "ngrok-skip-browser-warning": "true" } }
    );
  };

  const handleStop = async () => {
    if (!isCalling) return;

    setStopping(true);

    await fetch(`${apiBase}/call/stop`, {
      method: "POST",
      headers: { "ngrok-skip-browser-warning": "true" },
    });

    setStopping(false);
  };

  return (
    <div style={{ padding: "12px 16px" }}>
      <h3>📞 Call Control</h3>

      <input
        placeholder="Destination number"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        disabled={isCalling || autoCallRunning}
      />

      <input
        type="number"
        placeholder="Duration (seconds)"
        value={callSeconds}
        onChange={(e) => setCallSeconds(e.target.value)}
        disabled={isCalling || autoCallRunning}
      />

      <button onClick={handleCall} disabled={isCalling || autoCallRunning}>
        Call
      </button>

      <button onClick={handleStop} disabled={!isCalling || stopping}>
        Stop
      </button>

      {autoCallRunning && (
        <div>⚠️ Manual call disabled while auto call is running</div>
      )}

      <div>{statusMsg}</div>
    </div>
  );
}
