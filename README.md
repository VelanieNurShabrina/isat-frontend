# ISATPHONE Monitoring Dashboard (Frontend)

This project is a web-based dashboard for monitoring ISATPhone communication system, including signal, call, and SMS activity.
It provides real-time visualization and control through integration with a backend service.

---

## Live Demo

https://isat-frontend.vercel.app

---

## Features

### Signal Monitoring

* Real-time RSSI and BER display
* Signal strength conversion to dBm
* Signal history chart (RSSI & BER)
* Configurable signal reading interval

### Call Monitoring

* Manual call control (call & stop)
* Auto call cycle configuration
* Call performance summary:

  * Attempt
  * Success
  * CSSR (Call Success Rate)
* Call activity logs:

  * Phone number
  * Status (success / failed)
  * Cause code

### SMS Monitoring

* Send SMS manually
* Auto SMS cycle configuration
* SMS performance summary:

  * Attempt
  * Success rate
* SMS activity logs

### Dashboard

* Real-time data updates
* Interactive charts
* System status monitoring
* Clean and responsive UI layout

---

## Tech Stack

* React.js
* Bootstrap
* Fetch API (HTTP communication)
* Chart library (for signal visualization)

---

## Backend Integration

This frontend communicates with the backend via REST API.

Integrated features include:

* System status monitoring (`/status`)
* Call control & monitoring
* SMS sending & monitoring
* Signal polling & history
* Call & SMS logs
* Performance statistics (CSSR)

During development, the backend is accessed via ngrok tunnel.

---

## How to Run Locally

```bash
npm install
npm start
```

Open in browser:

```
http://localhost:3000
```

---

## Project Structure

* `src/` → Main application logic
* `components/` → UI components (charts, controls, logs)
* `services/` → API communication
* `public/` → Static assets

---

## Notes

* Requires backend service to function properly
* Ensure backend is running before using the dashboard
* Designed for ISATPhone modem monitoring system

---

## Author

Velanie Nur Shabrina
