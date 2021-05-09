const handlers = {
  'http:': require('http'),
  'https:': require('https')
};

const execute = (method, options, callback) => {
  const url = new URL(options.url);
  const req = handlers[url.protocol].request({
    headers: options.headers,
    hostname: url.hostname,
    method,
    path: url.pathname,
    port: url.port,
    protocol: url.protocol
  });

  req.on('response', res => callback(undefined, res));
  req.on('error', error => callback(error));

  req.end();
};

module.exports = {
  get: (...args) => execute('GET', ...args),
  head: (...args) => execute('HEAD', ...args)
};
