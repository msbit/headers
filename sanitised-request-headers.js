const disallowed = ['content-type', 'content-length', 'host', 'if-none-match'];

module.exports = {
  sanitised: (headers, override) => {
    const allowed = Object.entries(headers)
      .map(([k, v]) => [k.toLowerCase(), v])
      .filter(([k, v]) => !disallowed.includes(k));

    return Object.fromEntries(allowed.concat(Object.entries(override)));
  }
};
