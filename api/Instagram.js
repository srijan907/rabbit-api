import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL দিতে হবে" });
  }

  const primaryAPI = `https://apis.davidcyriltech.my.id/instagram?url=${encodeURIComponent(url)}`;
  const fallbackAPI = `https://bk9.fun/download/instagram?url=${encodeURIComponent(url)}`;

  try {
    const response1 = await fetch(primaryAPI);
    const data1 = await response1.json();

    if (data1.success || data1.status === 200) {
      const formatted = {
        creator: "YourName", // এখানে নিজের নাম বসাও
        status: 200,
        success: true,
        type: data1.type || "video",
        downloadUrl: data1.downloadUrl || data1.result?.download_url,
        title: data1.title || data1.result?.title,
        thumbnail: data1.thumbnail || data1.result?.thumbnail,
      };
      return res.status(200).json(formatted);
    }

    throw new Error("Primary API failed");
  } catch {
    try {
      const response2 = await fetch(fallbackAPI);
      const data2 = await response2.json();

      if (data2.status === true) {
        const bk9data = data2.BK9 && data2.BK9[0];
        if (!bk9data) throw new Error("Invalid BK9 data");

        const formatted = {
          creator: "YourName", // নিজের নাম বসাও
          status: 200,
          success: true,
          type: bk9data.type || "video",
          downloadUrl: bk9data.downloadUrl || bk9data.url,
          title: bk9data.title,
          thumbnail: bk9data.image,
        };
        return res.status(200).json(formatted);
      }
      throw new Error("Fallback API failed");
    } catch (err) {
      return res.status(500).json({ error: "দুটি API ব্যর্থ হয়েছে", details: err.message });
    }
  }
}
