import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'Instagram ভিডিওর URL দিতে হবে।' });
  }

  const primaryApi = `https://apis.davidcyriltech.my.id/instagram?url=${encodeURIComponent(url)}`;
  const fallbackApi = `https://bk9.fun/download/instagram?url=${encodeURIComponent(url)}`;

  try {
    const primaryRes = await fetch(primaryApi);
    const primaryData = await primaryRes.json();

    if (primaryData.status === 200 || primaryData.success === true) {
      // David Cyril এর ফরম্যাট 그대로 রিটার্ন করো
      return res.status(200).json({
        creator: "YourName",  // এখানে তোমার নাম লিখবে
        status: 200,
        success: true,
        result: primaryData.result || primaryData,
      });
    }

    throw new Error('Primary API failed');
  } catch (e) {
    try {
      const fallbackRes = await fetch(fallbackApi);
      const fallbackData = await fallbackRes.json();

      if (fallbackData.status === true) {
        // BK9 এর ফরম্যাটকে David Cyril এর ফরম্যাটে রূপান্তর
        return res.status(200).json({
          creator: "YourName", // তোমার নাম
          status: 200,
          success: true,
          result: {
            type: fallbackData.BK9[0]?.type || "video",
            quality: "unknown",
            title: fallbackData.BK9[0]?.title || "Instagram Video",
            thumbnail: fallbackData.BK9[0]?.image || null,
            download_url: fallbackData.BK9[0]?.url || fallbackData.BK9[0]?.downloadUrl || null,
          },
        });
      }
    } catch {
      return res.status(500).json({ error: 'দুটি API ব্যর্থ হয়েছে।' });
    }
  }

  return res.status(500).json({ error: 'কোন ফলাফল পাওয়া যায়নি।' });
}
