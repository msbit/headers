const disallowed = ['content-type', 'content-length', 'host', 'if-none-match'];

module.exports = {
  mapValues: (object, mapper) => {
    const result = Object.entries(object).map(([k, v]) => [k, mapper(v)]);
    return Object.fromEntries(result);
  },
  sanitised: (object, override = []) => {
    const result = Object.entries(object)
      .map(([k, v]) => [k.toLowerCase(), v])
      .filter(([k, v]) => !disallowed.includes(k));

    return Object.fromEntries(result.concat(Object.entries(override)));
  }
};
