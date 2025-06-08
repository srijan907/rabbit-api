export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.includes('pinterest.com')) {
    return res.status(400).json({
      success: false,
      creator: "MR RABBIT",
      error: "Please provide a valid Pinterest URL"
    });
  }

  const primary = `https://api.giftedtech.my.id/api/download/pinterestdl?apikey=gifted&url=${encodeURIComponent(url)}`;
  const fallback = `https://bk9.fun/download/pinterest?url=${encodeURIComponent(url)}`;

  try {
    const r1 = await fetch(primary);
    const d1 = await r1.json();

    if (d1.success && d1.result?.media?.length > 0) {
      const m = d1.result.media[0];
      return res.status(200).json({
        success: true,
        creator: "MR RABBIT",
        original_url: url,
        format: m.format,
        download_url: m.download_url,
        thumbnail: m.thumbnail || null
      });
    }

    throw new Error("Primary API failed");
  } catch (err) {
    try {
      const r2 = await fetch(fallback);
      const d2 = await r2.json();

      if (d2.status && d2.BK9?.length > 0) {
        const fileUrl = d2.BK9[0].url;
        return res.status(200).json({
          success: true,
          creator: "MR RABBIT",
          original_url: url,
          format: fileUrl.endsWith('.mp4') ? 'mp4' : 'jpg',
          download_url: fileUrl
        });
      }
    } catch (fallbackErr) {
      return res.status(500).json({
        success: false,
        creator: "MR RABBIT",
        error: "Both Pinterest APIs failed"
      });
    }
  }
}
