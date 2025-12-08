export default async function handler(req, res) {
  const NGROK = process.env.NGROK_URL;  // ⬅️ ambil dari environment
  const path = req.url.replace("/api/", "");

  const url = `${NGROK}/${path}`;

  try {
    const response = await fetch(url, { method: req.method });
    const text = await response.text();

    res.setHeader("Content-Type", "application/json");
    return res.status(200).send(text);
  } catch (err) {
    return res.status(500).json({
      error: "Proxy error",
      details: err.toString(),
    });
  }
}
