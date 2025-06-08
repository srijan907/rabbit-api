export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send(`
      <html><body style="background:#111;color:#fff;font-family:monospace;text-align:center;padding-top:50px;">
      <h2>🚫 Please provide a URL to shorten</h2>
      </body></html>
    `);
  }

  const api = `https://apis.davidcyriltech.my.id/tinyurl?url=${encodeURIComponent(url)}`;

  try {
    const response = await fetch(api);
    const data = await response.json();

    if (!data.success || !data.shortened_url) {
      return res.status(500).send(`
        <html><body style="background:#111;color:#fff;text-align:center;padding-top:50px;">
        <h2>⚠️ Failed to shorten the URL</h2>
        </body></html>
      `);
    }

    // ✅ Show output in pretty box at bottom
    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Short URL</title>
        <style>
          body {
            margin: 0;
            background-color: #111;
            color: #fff;
            font-family: monospace;
          }
          .response-box {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #222;
            padding: 16px 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(255,255,255,0.1);
            max-width: 90%;
            white-space: pre-wrap;
            text-align: left;
          }
        </style>
      </head>
      <body>
        <div class="response-box">
          ${JSON.stringify({
            creator: "MR RABBIT",
            success: true,
            original_url: data.original_url,
            shortened_url: data.shortened_url
          }, null, 2).replace(/\\n/g, "<br>").replace(/ /g, "&nbsp;")}
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    return res.status(500).send(`
      <html><body style="background:#111;color:#fff;text-align:center;padding-top:50px;">
      <h2>❌ Something went wrong</h2>
      </body></html>
    `);
  }
}
