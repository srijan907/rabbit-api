export default async function handler(req, res) {
  const { search } = req.query;

  if (!search) {
    return res.status(400).json({
      status: false,
      creator: "MR RABBIT",
      message: "Missing 'search' query parameter"
    });
  }

  try {
    const sourceURL = `https://api-aswin-sparky.koyeb.app/api/downloader/song?search=${encodeURIComponent(search)}`;
    const response = await fetch(sourceURL);
    const data = await response.json();

    if (!data.status) {
      return res.status(500).json({
        status: false,
        creator: "MR RABBIT",
        message: "Failed to fetch song data"
      });
    }

    res.status(200).json({
      status: true,
      creator: "MR RABBIT",
      data: {
        title: data.data.title,
        downloadURL: data.data.downloadURL
      }
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      creator: "MR RABBIT",
      message: "Something went wrong",
      error: err.message
    });
  }
}
