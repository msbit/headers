const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');

const sanitisedRequestHeaders = require('./sanitised-request-headers.js');

const port = 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('<form action="/headers" method="post"><input name="url" type="text"/><input type="submit" value="GO"/></form>');
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
      let body = '<table>';
      Object.keys(response.headers).forEach((key) => {
        body += `<tr><td>${key}</td><td>${response.headers[key]}</td></tr>`;
      });
      body += '</table>';
      res.send(body);
    }
  });
});

app.listen(port, () => {
  console.log(`Running on ${port}`);
});
