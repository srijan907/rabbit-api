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
        padding: 0;
        background: #0d0d0d;
        color: #00ffcc;
        font-family: 'Courier New', monospace;
      }
      .box {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #1a1a1a;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 15px #00ffcc55;
        white-space: pre-wrap;
        text-align: left;
        width: 90%;
        max-width: 600px;
        font-size: 16px;
      }
    </style>
  </head>
  <body>
    <div class="box">
      ${JSON.stringify({
        creator: "MR RABBIT",
        success: true,
        original_url: data.original_url,
        shortened_url: data.shortened_url
      }, null, 2)
      .replace(/\\n/g, '<br>')
      .replace(/ /g, '&nbsp;')}
    </div>
  </body>
  </html>
`);
