import React, { useState } from "react";
import RealtimeSignal from "./RealtimeSignal";
import HistoryChart from "./HistoryChart";
import CallControl from "./CallControl";

function App() {
  const apiBase = "/api"; // Vercel proxy

  return (
    <div className="container p-4">
      <h4>IsatPhone Signal Dashboard</h4>

      <div className="row mt-3">
        <div className="col-md-4">
          <RealtimeSignal apiBase={apiBase} />
        </div>

        <div className="col-md-8">
          <CallControl apiBase={apiBase} />
        </div>
      </div>

      <HistoryChart apiBase={apiBase} />
    </div>
  );
}

export default App;
