export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      status: false,
      message: "Missing Instagram URL!",
      creator: "MR RABBIT",
    });
  }

  try {
    // David Cyril API
    const david = await fetch(`https://apis.davidcyriltech.my.id/instagram?url=${encodeURIComponent(url)}`);
    const davidRaw = await david.json();

    if (davidRaw?.success && davidRaw?.downloadUrl) {
      return res.status(200).json({
        status: true,
        message: "Download link generated successfully.",
        creator: "MR RABBIT",
        result: {
          type: davidRaw.type || "mp4",
          url: davidRaw.downloadUrl,
          thumbnail: "", // thumbnail থাকলে বসান
          description: "" // caption থাকলে বসান
        }
      });
    }

    // fallback: BK9 API
    const bk9 = await fetch(`https://api.bk9.app/instadl?url=${encodeURIComponent(url)}`);
    const bk9Raw = await bk9.json();

    if (bk9Raw?.success && bk9Raw?.data?.url) {
      return res.status(200).json({
        status: true,
        message: "Download link generated successfully.",
        creator: "MR RABBIT",
        result: {
          type: "mp4",
          url: bk9Raw.data.url,
          thumbnail: bk9Raw.data.thumbnail || "",
          description: bk9Raw.data.caption || ""
        }
      });
    }

    // If all fail
    return res.status(500).json({
      status: false,
      message: "Failed to fetch video.",
      creator: "MR RABBIT",
    });

  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      creator: "MR RABBIT",
    });
  }
}
