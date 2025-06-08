export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      creator: "MR RABBIT",
      success: false,
      error: "Please provide a URL to shorten"
    });
  }

  const api = `https://apis.davidcyriltech.my.id/tinyurl?url=${encodeURIComponent(url)}`;

  try {
    const response = await fetch(api);
    const data = await response.json();

    if (!data.success) {
      return res.status(500).json({
        creator: "MR RABBIT",
        success: false,
        error: "Failed to shorten the URL"
      });
    }

    const result = {
      creator: "MR RABBIT",
      success: true,
      original_url: data.original_url,
      shortened_url: data.shortened_url
    };

    res.setHeader("Content-Type", "application/json");
    return res.status(200).send(JSON.stringify(result, null, 2)); // Pretty response
  } catch (error) {
    return res.status(500).json({
      creator: "MR RABBIT",
      success: false,
      error: "Something went wrong"
    });
  }
}
