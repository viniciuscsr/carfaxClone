const express = require('express');
const router = express.Router();
const bonsai_url = process.env.BONSAI_URL;
const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  host: bonsai_url,
});

// HOME PAGE

router.get('/', function (req, res) {
  res.render('home');
});

// ABOUT PAGE

router.get('/about', function (req, res) {
  res.render('about');
});

// SEARCH

router.get('/search', async (req, res) => {
  const q = req.query.q;
  console.log('search route');
  console.log(q);
  let queryResponse;
  try {
    queryResponse = await client.search({
      index: 'cars',
      q: q,
    });
  } catch (err) {
    console.log(err);
  }
  console.log(queryResponse.hits.hits);
  res.render('search', { results: queryResponse.hits.hits });
});

module.exports = router;
