import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  const title = req.query.title;
  if (!title) {
    return res.status(400).json({ status: false, creator: "MR RABBIT", message: "Missing 'title' parameter" });
  }

  try {
    const searchUrl = `https://m.youtube.com/results?search_query=${encodeURIComponent(title)}`;
    const { data } = await axios.get(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const $ = cheerio.load(data);
    const scriptTag = $('script').filter((i, el) => $(el).html()?.includes('var ytInitialData')).first();

    if (!scriptTag || !scriptTag.html()) {
      return res.status(500).json({ status: false, creator: "MR RABBIT", message: "ytInitialData not found in page" });
    }

    const ytInitialRaw = scriptTag.html().split('var ytInitialData =')[1]?.trim().replace(/;$/, '');
    if (!ytInitialRaw) {
      return res.status(500).json({ status: false, creator: "MR RABBIT", message: "ytInitialData malformed" });
    }

    const ytData = JSON.parse(ytInitialRaw);
    const videos = ytData?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents;
    const firstVideo = videos.find(v => v.videoRenderer)?.videoRenderer;

    if (!firstVideo) {
      return res.status(404).json({ status: false, creator: "MR RABBIT", message: "No video found" });
    }

    const videoId = firstVideo.videoId;
    const videoUrl = `https://youtu.be/${videoId}`;
    const titleText = firstVideo.title?.runs?.[0]?.text || 'Unknown';
    const author = firstVideo.ownerText?.runs?.[0]?.text || 'Unknown';
    const thumbnail = firstVideo.thumbnail?.thumbnails?.pop()?.url;

    const mp3Api = `https://api-aswin-sparky.koyeb.app/api/downloader/song?search=${videoUrl}`;
    const mp4Api = `https://api-aswin-sparky.koyeb.app/api/downloader/ytv?url=${videoUrl}`;

    const [mp3Res, mp4Res] = await Promise.all([
      axios.get(mp3Api).catch(() => ({ data: {} })),
      axios.get(mp4Api).catch(() => ({ data: {} }))
    ]);

    const mp3 = mp3Res.data?.data?.downloadURL || null;
    const mp4 = mp4Res.data?.data?.downloadURL || null;

    return res.status(200).json({
      status: true,
      creator: "MR RABBIT",
      title: titleText,
      author,
      videoId,
      thumbnail,
      mp3,
      mp4
    });

  } catch (err) {
    return res.status(500).json({
      status: false,
      creator: "MR RABBIT",
      message: "Internal Server Error",
      error: err.message
    });
  }
}
