// src/App.js
import React, { useState, useEffect } from "react";
import HistoryChart from "./HistoryChart";
import RealtimeSignal from "./RealtimeSignal";
import IntervalControl from "./IntervalControl";
import CallControl from "./CallControl";
import SmsControl from "./SmsControl";
import AutoCallControl from "./AutoCallControl";
import AutoSmsControl from "./AutoSmsControl";
import SystemStatusCard from "./SystemStatusCard";
import CallStats from "./CallStats";
import CallLogTable from "./CallLogTable";

function App() {
  // Semua request lewat Vercel -> /api -> proxy -> ngrok -> Flask
  const apiBase = "https://heterophoric-franco-unplumbed.ngrok-free.dev";

  const [signalInterval, setSignalInterval] = useState(10);
  const [isCalling, setIsCalling] = useState(false);
  const [autoCall, setAutoCall] = useState({
    enabled: false,
    interval: 30,
    number: "",
    duration: 15,
  });
  const [autoSms, setAutoSms] = useState({
    enabled: false,
    interval: 300,
    number: "",
    message: "",
  });
  const [systemStatus, setSystemStatus] = useState(null);

  // Saat halaman pertama kali load, sync ke backend /status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${apiBase}/status`, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });
        if (!res.ok) return;

        const json = await res.json();
        setSystemStatus(json);

        // ===== SIGNAL INTERVAL =====
        if (typeof json.interval === "number") {
          setSignalInterval(json.interval);
        }

        // ===== AUTO CALL SYNC (FULL SYNC) =====
        if (json.auto_call) {
          setAutoCall({
            enabled: json.auto_call.enabled,
            interval: json.auto_call.interval,
            number: json.auto_call.number || "",
            duration: json.auto_call.duration || 15,
          });
        }

        // ===== AUTO SMS SYNC (FULL SYNC) =====
        if (json.auto_sms) {
          setAutoSms({
            enabled: json.auto_sms.enabled,
            interval: json.auto_sms.interval,
            number: json.auto_sms.number || "",
            message: json.auto_sms.message || "",
          });
        }

        // ===== CALL STATE =====
        if (typeof json.call_active === "boolean") {
          setIsCalling(json.call_active);
        }
      } catch (e) {
        console.log("Status fetch error:", e);
      }
    };

    fetchStatus();
    const timer = window.setInterval(fetchStatus, 1000);
    return () => window.clearInterval(timer);
  }, [apiBase]);

  // UI Theme Colors
  const colors = {
    bg: "#f4f7fa",
    sidebar: "#ffffff",
    border: "#e1e4e8",
    accent: "#0052cc",
    textMain: "#172b4d",
    textMuted: "#5e6c84",
  };

  // Ganti bagian return di App.js kamu
  return (
    <>
      <style>{`
        :root {
          --bg-sidebar: #ffffff;
          --bg-main: #f8fafc;
          --primary: #2563eb;
          --border: #e2e8f0;
          --text-dark: #1e293b;
          --text-muted: #64748b;
          --card-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }
        body { margin: 0; background: var(--bg-main); font-family: 'Inter', system-ui, sans-serif; }
        .dashboard-container { display: flex; min-height: 100vh; }
        
        /* Sidebar Professional */
        .sidebar { 
          width: 280px; background: var(--bg-sidebar); border-right: 1px solid var(--border);
          padding: 2rem; display: flex; flex-direction: column; gap: 2rem; position: sticky; top: 0; height: 100vh; box-sizing: border-box;
        }
        .sidebar-title { font-size: 1.25rem; font-weight: 800; color: var(--text-dark); letter-spacing: -0.025em; display: flex; align-items: center; gap: 10px; }
        .sidebar-section-label { font-size: 0.7rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem; }

        /* Main Content */
        .main-content { flex: 1; padding: 2.5rem; max-width: 1400px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem; }
        .glass-card { background: white; border: 1px solid var(--border); border-radius: 16px; padding: 1.5rem; box-shadow: var(--card-shadow); transition: all 0.2s; }
        
        /* Layout Grid */
        .grid-kpi { display: grid; grid-template-columns: 1.5fr 1fr; gap: 2rem; }
        .grid-controls { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .section-title { font-size: 1rem; font-weight: 700; color: var(--text-dark); margin: 0; display: flex; align-items: center; gap: 8px; }
        
        /* Form Inputs Reset */
        input, select, textarea { 
          border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; font-size: 0.9rem; width: 100%; box-sizing: border-box; margin-top: 5px;
          background: #fcfcfd; transition: border-color 0.2s;
        }
        input:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
      `}</style>

      <div className="dashboard-container">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-title">📡 IsatMonitor <span style={{fontSize: '0.6rem', padding: '2px 6px', background: '#eff6ff', color: '#2563eb', borderRadius: '4px'}}>PRO</span></div>
          
          <div>
            <div className="sidebar-section-label">Device Connectivity</div>
            <SystemStatusCard status={systemStatus} />
          </div>

          <div>
            <div className="sidebar-section-label">System Preferences</div>
            <IntervalControl apiBase={apiBase} interval={signalInterval} onIntervalChange={setSignalInterval} />
          </div>

          <div style={{marginTop: 'auto'}}>
            <div className="glass-card" style={{padding: '1rem', background: '#1e293b', color: 'white', border: 'none'}}>
              <CallStats apiBase={apiBase} />
            </div>
          </div>
        </aside>

        {/* MAIN AREA */}
        <main className="main-content">
          
          {/* Header Dashboard */}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2 style={{margin: 0, fontWeight: 800, fontSize: '1.75rem'}}>Network Overview</h2>
            <div style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>Last sync: {new Date().toLocaleTimeString()}</div>
          </div>

          {/* Row 1: Signal Strength & Performance */}
          <div className="grid-kpi">
            <div className="glass-card">
              <div className="section-header">
                <h3 className="section-title">📶 Realtime Signal Strength</h3>
                <div style={{width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e'}}></div>
              </div>
              <RealtimeSignal apiBase={apiBase} />
            </div>
            
            <div className="glass-card" style={{background: 'linear-gradient(to bottom right, #ffffff, #f8fafc)'}}>
              <h3 className="section-title" style={{marginBottom: '1rem'}}>📊 Performance KPI</h3>
              {/* Tempatkan CallPerformanceToday di sini */}
              <div style={{height: '100%', display: 'flex', alignItems: 'center'}}>
                 <CallStats /> 
              </div>
            </div>
          </div>

          {/* Row 2: Visual Chart */}
          <div className="glass-card">
            <h3 className="section-title">📈 Signal Level Trend (RSSI & BER)</h3>
            <div style={{marginTop: '1.5rem', height: '350px'}}>
              <HistoryChart apiBase={apiBase} refreshInterval={signalInterval} />
            </div>
          </div>

          {/* Row 3: Action & Logs */}
          <div className="grid-controls">
            <div className="glass-card">
              <h3 className="section-title">⚡ Quick Actions</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '1.5rem'}}>
                <div style={{padding: '1.25rem', border: '1px solid #f1f5f9', borderRadius: '12px', background: '#f8fafc'}}>
                  <CallControl apiBase={apiBase} isCalling={isCalling} autoCallRunning={autoCall.enabled} onCallStateChange={setIsCalling} />
                  <AutoCallControl apiBase={apiBase} autoCall={autoCall} onChange={setAutoCall} />
                </div>
                <div style={{padding: '1.25rem', border: '1px solid #f1f5f9', borderRadius: '12px', background: '#f8fafc'}}>
                  <SmsControl apiBase={apiBase} autoSmsRunning={autoSms.enabled} />
                  <AutoSmsControl apiBase={apiBase} autoSms={autoSms} onChange={setAutoSms} />
                </div>
              </div>
            </div>

            <div className="glass-card" style={{display: 'flex', flexDirection: 'column'}}>
              <h3 className="section-title">📑 Recent Activity Logs</h3>
              <div style={{marginTop: '1.5rem', flex: 1, overflowY: 'auto', maxHeight: '500px'}}>
                <CallLogTable apiBase={apiBase} />
              </div>
            </div>
          </div>

        </main>
      </div>
    </>
  );
}

export default App;
