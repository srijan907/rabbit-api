import express from 'express';
import fetch from 'node-fetch';
import cheerio from 'cheerio';

const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('🔞 MrRabbit NSFW API Running!');
});

app.get('/api/2xnxx', async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: 'Missing query parameter' });

  try {
    const data = await xnxxsearch(query);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch', detail: err.message });
  }
});

async function xnxxsearch(query) {
  return new Promise((resolve, reject) => {
    const baseurl = 'https://www.xnxx.com';
    fetch(`${baseurl}/search/${query}/${Math.floor(Math.random() * 3) + 1}`)
      .then(res => res.text())
      .then(html => {
        const $ = cheerio.load(html);
        const results = [];

        $('div.mozaique > div').each((i, el) => {
          const link = baseurl + $(el).find('a').attr('href');
          const title = $(el).find('a').attr('title');
          const info = $(el).find('p.metadata').text();
          if (title && link) results.push({ title, info, link });
        });

        resolve({ status: true, code: 200, result: results });
      })
      .catch(err => reject(err));
  });
}

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
