export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Missing Instagram URL parameter!",
      creator: "MR RABBIT"
    });
  }

  try {
    const response = await fetch(`https://apis.davidcyriltech.my.id/instagram?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    if (data.success) {
      // ব্র্যান্ডেড creator নাম সেট করুন
      data.creator = "MR RABBIT";

      return res.status(200).json(data);
    } else {
      return res.status(500).json({
        success: false,
        status: 500,
        message: "Failed to fetch video from David Cyril API.",
        creator: "MR RABBIT"
      });
    }
  } catch (error) {
    console.error("Error fetching from David Cyril API:", error.message);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Internal Server Error",
      creator: "MR RABBIT"
    });
  }
}
