export default async function handler(req, res) {
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({
      creator: "MR RABBIT",
      status: "error",
      message: "Missing 'text' query parameter"
    });
  }

  try {
    const response = await fetch(`https://apis.davidcyriltech.my.id/download/apk?text=${encodeURIComponent(text)}`);
    const data = await response.json();

    if (!data.success) {
      return res.status(500).json({
        creator: "MR RABBIT",
        status: "error",
        message: "Failed to fetch data from source API"
      });
    }

    return res.json({
      creator: "MR RABBIT",
      status: "success",
      app: {
        name: data.apk_name,
        thumbnail: data.thumbnail,
        download_url: data.download_link
      }
    });
  } catch (error) {
    return res.status(500).json({
      creator: "MR RABBIT",
      status: "error",
      message: "Internal server error"
    });
  }
}
