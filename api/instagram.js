export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      success: false,
      status: 400,
      creator: "MR RABBIT"
    });
  }

  try {
    const response = await fetch(`https://apis.davidcyriltech.my.id/instagram?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    if (data.success) {
      data.creator = "MR RABBIT";

      // message ফিল্ড বাদ দিতে চাইলে delete করতে পারেন যদি থাকে
      if (data.message) delete data.message;

      return res.status(200).json(data);
    } else {
      return res.status(500).json({
        success: false,
        status: 500,
        creator: "MR RABBIT"
      });
    }
  } catch (error) {
    console.error("Error fetching from David Cyril API:", error.message);
    return res.status(500).json({
      success: false,
      status: 500,
      creator: "MR RABBIT"
    });
  }
}
