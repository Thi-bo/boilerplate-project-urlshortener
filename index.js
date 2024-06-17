require('dotenv').config();
const express = require('express');
const dns = require('dns');
const bodyParser = require('body-parser');
const cors = require('cors');
const shortUrls = {};
let shortUrlId = 0;
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API pour raccourcir les URL
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  // Vérifier si l'URL est valide
  dns.lookup(new URL(originalUrl).hostname, (err) => {
    if (err) {
      res.json({ error: 'invalid url' });
    } else {
      const shortUrl = ++shortUrlId;
      shortUrls[shortUrl] = originalUrl;
      res.json({ original_url: originalUrl, short_url: shortUrl });
    }
  });
});

// Redirection vers l'URL d'origine
app.get('/api/shorturl/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;
  const originalUrl = shortUrls[shortUrl];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'invalid short url' });
  }
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
