const { version } = require('./package.json');
const bodyParser = require('body-parser');
const express = require('express');

const request = require('./request.js');
const sanitisedRequestHeaders = require('./sanitised-request-headers.js');

const port = 3000;

const app = express();

app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.render('index', {
  title: 'index',
  version: version
}));

app.get('/headers', (req, res) => res.redirect('/'));
app.post('/headers', async (req, res) => {
  const options = {
    headers: sanitisedRequestHeaders(req, req.headers),
    url: req.body.url
  };

  try {
    let response = await request.head(options);

    if (response.statusCode !== 405) {
      handleHeaders(req, res, response);
      return;
    }

    response = await request.get(options);

    handleHeaders(req, res, response);
  } catch (error) {
    errorHeaders(req, res, error);
  }
});

const handleHeaders = (req, res, response) => {
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
};

const errorHeaders = (req, res, error) => {
  const errorBody = {
    error: 'There has been an error'
  };
  if (error.errno) {
    errorBody.error = error.errno;
  }
  if (error.reason) {
    errorBody.error = error.reason;
  }
  res.status(500).send(errorBody);
};

app.listen(port, () => console.info(`Running on ${port}`));
