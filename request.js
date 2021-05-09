const handlers = {
  'http:': require('http'),
  'https:': require('https')
};

const execute = (method, options) => {
  const url = new URL(options.url);
  const req = handlers[url.protocol].request({
    headers: options.headers,
    hostname: url.hostname,
    method,
    path: url.pathname,
    port: url.port,
    protocol: url.protocol
  });

  const result = new Promise((resolve, reject) => {
    req.on('response', res => resolve(res));
    req.on('error', error => reject(error));
  });

  req.end();

  return result;
};

module.exports = {
  get: (...args) => execute('GET', ...args),
  head: (...args) => execute('HEAD', ...args)
};
