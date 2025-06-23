import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  const title = req.query.title;
  if (!title) {
    return res.json({ status: false, creator: "MR RABBIT", message: "Missing 'title' parameter" });
  }

  try {
    // Step 1: YouTube search
    const searchUrl = `https://m.youtube.com/results?search_query=${encodeURIComponent(title)}`;
    const { data } = await axios.get(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const $ = cheerio.load(data);
    const scriptTag = $('script').filter((i, el) => $(el).html().includes('var ytInitialData')).first();
    const ytInitialRaw = scriptTag.html().split('var ytInitialData =')[1].trim().replace(/;$/, '');
    const ytData = JSON.parse(ytInitialRaw);

    const videoData = ytData?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents;

    const firstVideo = videoData.find(v => v.videoRenderer)?.videoRenderer;
    if (!firstVideo) return res.json({ status: false, creator: "MR RABBIT", message: "No video found" });

    const videoId = firstVideo.videoId;
    const videoUrl = `https://youtu.be/${videoId}`;
    const titleText = firstVideo.title?.runs?.[0]?.text || 'Unknown';
    const author = firstVideo.ownerText?.runs?.[0]?.text || 'Unknown';
    const thumbnail = firstVideo.thumbnail?.thumbnails?.pop()?.url;

    // Step 2: MP3 & MP4 using Aswin Sparky API
    const mp3Api = `https://api-aswin-sparky.koyeb.app/api/downloader/song?search=${videoUrl}`;
    const mp4Api = `https://api-aswin-sparky.koyeb.app/api/downloader/ytv?url=${videoUrl}`;

    const [mp3Res, mp4Res] = await Promise.all([
      axios.get(mp3Api),
      axios.get(mp4Api)
    ]);

    const mp3 = mp3Res.data?.data?.downloadURL || null;
    const mp4 = mp4Res.data?.data?.downloadURL || null;

    return res.json({
      status: true,
      creator: "MR RABBIT",
      title: titleText,
      author,
      videoId,
      thumbnail,
      mp3,
      mp4
    });

  } catch (e) {
    return res.json({ status: false, creator: "MR RABBIT", message: "Internal error", error: e.message });
  }
}
