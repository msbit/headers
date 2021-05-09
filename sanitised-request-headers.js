const disallowedHeaders = ['content-type', 'content-length', 'host', 'if-none-match'];

module.exports = function (originalRequest, originalHeaders) {
  const headers = {};

  Object.keys(originalHeaders).forEach((key) => {
    headers[key.toLowerCase()] = originalHeaders[key];
  });
  disallowedHeaders.forEach((key) => delete headers[key]);

  const url = new URL(originalRequest.body.url);
  headers.host = url.hostname;

  return headers;
};
