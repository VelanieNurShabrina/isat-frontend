export default async function handler(req, res) {
  // Ambil path setelah /api/
  const path = req.url.replace("/api/", "");

  // URL backend via ngrok
  const url = `https://heterophoric-franco-unplumbed.ngrok-free.dev/${path}`;

  try {
    const response = await fetch(url, {
      method: req.method,
    });

    const text = await response.text();

    // Paksa selalu JSON supaya React tidak error
    res.setHeader("Content-Type", "application/json");
    return res.status(200).send(text);

  } catch (err) {
    return res.status(500).json({
      error: "Proxy error",
      details: err.toString(),
    });
  }
}
