const { version } = require('./package.json');
const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');

const sanitisedRequestHeaders = require('./sanitised-request-headers.js');

const port = 3000;

const app = express();

app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'index',
    version: version
  });
});

app.get('/headers', (req, res) => res.redirect('/'));
app.post('/headers', (req, res) => {
  const options = {
    headers: sanitisedRequestHeaders(req, req.headers),
    method: 'head',
    url: req.body.url
  };
  request.head(options, (error, response, body) => {
    if (error) {
      res.status(500).send({ error: error });
    } else {
      const order = Object.keys(response.headers);
      order.sort();
      res.render('headers', {
        headers: response.headers,
        order: order,
        status: response.statusCode,
        title: req.body.url,
        url: req.body.url,
        version: version
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Running on ${port}`);
});
