import fetch from "node-fetch";

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL দিতে হবে" });

  const api = `https://apis.davidcyriltech.my.id/tinyurl?url=${encodeURIComponent(url)}`;

  try {
    const response = await fetch(api);
    const data = await response.json();

    if (data.success) {
      res.status(200).json({
        creator: "MR RABBIT",
        success: true,
        original_url: url,
        shortened_url: data.shortened_url,
      });
    } else {
      res.status(500).json({ error: "Shortening failed" });
    }
  } catch (err) {
    res.status(500).json({ error: "API error" });
  }
}
