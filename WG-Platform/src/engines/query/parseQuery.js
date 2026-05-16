export function parseQuery(input = '') {
  const search = typeof input === 'string' ? input.replace(/^\?/, '') : input;
  const params = new URLSearchParams(search);
  const output = {};

  params.forEach((value, key) => {
    if (output[key] === undefined) {
      output[key] = value;
      return;
    }

    output[key] = Array.isArray(output[key])
      ? [...output[key], value]
      : [output[key], value];
  });

  return output;
}
