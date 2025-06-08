export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.setHeader("Content-Type", "application/json").status(400).send(JSON.stringify({
      creator: "MR RABBIT",
      status: "error",
      message: "Missing 'url' query parameter"
    }, null, 2));
  }

  try {
    const response = await fetch(`https://apis.davidcyriltech.my.id/youtube/mp4?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    if (!data.status || !data.result) {
      return res.setHeader("Content-Type", "application/json").status(500).send(JSON.stringify({
        creator: "MR RABBIT",
        status: "error",
        message: "Failed to fetch video data"
      }, null, 2));
    }

    return res.setHeader("Content-Type", "application/json").status(200).send(JSON.stringify({
      creator: "MR RABBIT",
      status: "success",
      video: {
        title: data.result.title,
        thumbnail: data.result.thumbnail,
        download_url: data.result.url
      }
    }, null, 2));
  } catch (err) {
    return res.setHeader("Content-Type", "application/json").status(500).send(JSON.stringify({
      creator: "MR RABBIT",
      status: "error",
      message: "Internal server error"
    }, null, 2));
  }
}
