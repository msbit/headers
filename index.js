const { version } = require('./package.json');
const bodyParser = require('body-parser');
const express = require('express');

const request = require('./request.js');
const { mapValues, sanitised } = require('./object-util.js');

const port = 3000;

const app = express();

app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (_, res) => res.render('index', { title: 'index', version }));

app.get('/headers', (req, res) => res.redirect('/'));
app.post('/headers', async (req, res) => {
  try {
    const url = new URL(req.body.url);
    const headers = sanitised(req.headers, { host: url.hostname });
    const options = { headers, url };

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

const handleHeaders = (req, res, { headers, statusCode }) => {
  const order = Object.keys(headers);
  order.sort();
  res.render('headers', {
    headers: mapValues(headers, v => Array.isArray(v) ? v.join('\n') : v),
    order,
    status: statusCode,
    title: req.body.url,
    url: req.body.url,
    version
  });
};

const errorHeaders = (req, res, error) => {
  console.log(error);
  const body = { error: 'There has been an error' };
  if (error.errno) { body.error = error.errno; }
  if (error.reason) { body.error = error.reason; }
  res.status(500).send(body);
};

app.listen(port, _ => console.info(`Running on ${port}`));
