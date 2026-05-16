export function omitEmptyValues(source = {}) {
  return Object.entries(source).reduce((target, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      target[key] = value;
    }

    return target;
  }, {});
}

export function pick(source = {}, keys = []) {
  return keys.reduce((target, key) => {
    if (key in source) {
      target[key] = source[key];
    }

    return target;
  }, {});
}
