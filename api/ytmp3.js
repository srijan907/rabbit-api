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
    const response = await fetch(`https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    if (!data.success || !data.result) {
      return res.setHeader("Content-Type", "application/json").status(500).send(JSON.stringify({
        creator: "MR RABBIT",
        status: "error",
        message: "Failed to fetch music info"
      }, null, 2));
    }

    const result = {
      creator: "MR RABBIT",
      status: "success",
      music: {
        title: data.result.title,
        thumbnail: data.result.image,
        download_url: data.result.downloadUrl
      }
    };

    return res.setHeader("Content-Type", "application/json").status(200).send(JSON.stringify(result, null, 2));

  } catch (error) {
    return res.setHeader("Content-Type", "application/json").status(500).send(JSON.stringify({
      creator: "MR RABBIT",
      status: "error",
      message: "Internal server error"
    }, null, 2));
  }
}
