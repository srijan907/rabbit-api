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
    // Try David Cyril API
    const dc = await fetch(`https://apis.davidcyriltech.my.id/instagram?url=${encodeURIComponent(url)}`);
    const dcRes = await dc.json();

    if (dcRes?.success && dcRes?.downloadUrl) {
      return res.status(200).json({
        status: true,
        message: "Download link generated successfully.",
        creator: "MR RABBIT",
        result: {
          type: dcRes.type || "mp4",
          url: dcRes.downloadUrl,
          thumbnail: "",
          description: ""
        }
      });
    }

    // Fallback to BK9 API
    const bk9 = await fetch(`https://api.bk9.app/instadl?url=${encodeURIComponent(url)}`);
    const bk9Res = await bk9.json();

    if (bk9Res?.success && bk9Res?.data?.url) {
      return res.status(200).json({
        status: true,
        message: "Download link generated successfully.",
        creator: "MR RABBIT",
        result: {
          type: "mp4",
          url: bk9Res.data.url,
          thumbnail: bk9Res.data.thumbnail || "",
          description: bk9Res.data.caption || ""
        }
      });
    }

    // All failed
    return res.status(500).json({
      status: false,
      message: "Video download failed. Try another link.",
      creator: "MR RABBIT"
    });

  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      creator: "MR RABBIT"
    });
  }
}
