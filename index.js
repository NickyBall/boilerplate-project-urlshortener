require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Url = require('./models/url').UrlModel;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl/:shortid', async (req, res) => {
  const { shortid } = req.params;
  try {
    const url = await Url.findOne({ short_url: shortid });
    if (url) {
      return res.redirect(url.original_url);
    }
    return res.status(404).json({ error: 'No URL found' });
  
  } catch (err) {
    res.json({error: 'invalid url'})
  }
});

app.post('/api/shorturl', async (req, res) => {
  const { url } = req.body;
  try {
    const urlObj = new URL(url);
    console.log(urlObj.protocol);
    if (!urlObj.protocol.startsWith('http')) {
      return res.json({ error: 'invalid url' });
    }
    const result = await Url.findOne({ original_url: url });
    if (result) {
      return res.json({ original_url: result.original_url, short_url: result.short_url });
    } else {
      const newUrl = new Url({ original_url: url, short_url: Math.floor(Math.random() * 100000) });
      await newUrl.save();
      return res.json({ original_url: newUrl.original_url, short_url: newUrl.short_url });
    }
  } catch (err) {
    console.error(err);
    return res.json({ error: 'invalid url' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
