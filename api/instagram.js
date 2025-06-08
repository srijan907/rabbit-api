export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      status: false,
      message: "Instagram URL parameter is missing!",
      creator: "MR RABBIT",
    });
  }

  try {
    // ১ম ট্রাই: David Cyril API
    const david = await fetch(`https://apis.davidcyriltech.my.id/instagram?url=${encodeURIComponent(url)}`);
    const davidData = await david.json();

    if (davidData.status && davidData.result) {
      return res.status(200).json({
        status: true,
        message: "Success from David Cyril",
        creator: "MR RABBIT",
        result: davidData.result,
      });
    }

    // fallback: BK9 API
    const bk9 = await fetch(`https://api.bk9.app/instadl?url=${encodeURIComponent(url)}`);
    const bk9Data = await bk9.json();

    if (bk9Data.success && bk9Data.data) {
      return res.status(200).json({
        status: true,
        message: "Success from BK9",
        creator: "MR RABBIT",
        result: {
          url: bk9Data.data.url,
          thumbnail: bk9Data.data.thumbnail,
          description: bk9Data.data.caption,
        },
      });
    }

    throw new Error("No API responded properly");

  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Something went wrong!",
      creator: "MR RABBIT",
    });
  }
}
