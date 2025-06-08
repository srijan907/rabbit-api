export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      creator: "MR RABBIT",
      status: "error",
      message: "Missing 'url' query parameter"
    });
  }

  let primarySuccess = false;

  // 🟢 1. Try Primary API (David Cyril)
  try {
    const primaryRes = await fetch(`https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(url)}`);
    const primary = await primaryRes.json();

    if (primary.success && primary.result) {
      primarySuccess = true;
      return res.status(200).json({
        creator: "MR RABBIT",
        status: "success",
        music: {
          title: primary.result.title,
          thumbnail: primary.result.image,
          download_url: primary.result.downloadUrl
        }
      });
    }
  } catch (e) {
    // Logging (optional)
    console.warn("Primary API failed:", e.message);
  }

  // 🔁 2. Try Fallback API (BK9)
  try {
    const fallbackRes = await fetch(`https://bk9.fun/download/ytmp3?url=${encodeURIComponent(url)}&type=mp3`);
    const fallback = await fallbackRes.json();

    if (fallback.status && fallback.BK9) {
      return res.status(200).json({
        creator: "MR RABBIT",
        status: "success",
        music: {
          title: fallback.BK9.title,
          thumbnail: fallback.BK9.image,
          download_url: fallback.BK9.downloadUrl
        }
      });
    }
  } catch (e) {
    console.warn("Fallback API failed:", e.message);
  }

  // ❌ 3. If both fail
  return res.status(500).json({
    creator: "MR RABBIT",
    status: "error",
    message: "Eror"
  });
}
