export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Instagram URL প্রয়োজন" });

  const primary = `https://apis.davidcyriltech.my.id/instagram?url=${encodeURIComponent(url)}`;
  const fallback = `https://bk9.fun/download/instagram?url=${encodeURIComponent(url)}`;

  try {
    const r1 = await fetch(primary);
    const d1 = await r1.json();
    if (d1.success || d1.status === 200) {
      return res.status(200).json({
        creator: "Your Name",
        status: 200,
        success: true,
        type: d1.type || "mp4",
        downloadUrl: d1.downloadUrl || d1.result?.url || d1.url
      });
    }
    throw new Error("Primary failed");
  } catch {
    try {
      const r2 = await fetch(fallback);
      const d2 = await r2.json();
      if (d2.status && d2.BK9?.[0]?.url) {
        return res.status(200).json({
          creator: "Your Name",
          status: 200,
          success: true,
          type: d2.BK9[0].type || "unknown",
          downloadUrl: d2.BK9[0].url
        });
      }
    } catch {
      return res.status(500).json({ error: "দুই API-ই ব্যর্থ হয়েছে" });
    }
  }

  return res.status(500).json({ error: "ফলাফল পাওয়া যায়নি" });
}
