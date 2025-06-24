import express from 'express';
import fetch from 'node-fetch';
import cheerio from 'cheerio';

const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('🔞 MrRabbit NSFW API Working!');
});

// Main API route
app.get('/api/2xnxx.js', async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: 'Missing query parameter' });

  try {
    const data = await xnxxSearch(query);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch', detail: err.message });
  }
});

async function xnxxSearch(query) {
  return new Promise((resolve, reject) => {
    const baseUrl = 'https://www.xnxx.com';
    const page = Math.floor(Math.random() * 3) + 1;

    fetch(`${baseUrl}/search/${encodeURIComponent(query)}/${page}`)
      .then(res => res.text())
      .then(html => {
        const $ = cheerio.load(html);
        const results = [];

        $('div.mozaique > div').each((i, el) => {
          const link = baseUrl + ($(el).find('a').attr('href') || '');
          const title = $(el).find('a').attr('title');
          const info = $(el).find('p.metadata').text();
          if (title && link.includes('/video')) {
            results.push({ title, info, link });
          }
        });

        resolve({ status: true, code: 200, result: results });
      })
      .catch(err => reject(err));
  });
}

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
