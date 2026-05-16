const isObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

export function getValueByPath(source, path, fallbackValue = undefined) {
  if (!path) {
    return fallbackValue;
  }

  const keys = Array.isArray(path) ? path : String(path).split('.');
  let cursor = source;

  for (const key of keys) {
    if (cursor == null || !(key in Object(cursor))) {
      return fallbackValue;
    }

    cursor = cursor[key];
  }

  return cursor === undefined ? fallbackValue : cursor;
}

export function setValueByPath(source, path, value) {
  const keys = Array.isArray(path) ? path : String(path).split('.');
  const root = Array.isArray(source) ? [...source] : { ...(source || {}) };
  let cursor = root;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      cursor[key] = value;
      return;
    }

    const nextValue = cursor[key];
    cursor[key] = Array.isArray(nextValue)
      ? [...nextValue]
      : isObject(nextValue)
        ? { ...nextValue }
        : {};
    cursor = cursor[key];
  });

  return root;
}

export function normalizeInputValue(input) {
  if (input && input.target) {
    const { checked, type, value } = input.target;
    return type === 'checkbox' ? checked : value;
  }

  return input;
}

export function mapInitialValues(schema = [], defaultValue = {}) {
  return schema.reduce((values, field) => {
    if (!field?.name || field.defaultValue === undefined) {
      return values;
    }

    const currentValue = getValueByPath(values, field.name);
    return currentValue === undefined
      ? setValueByPath(values, field.name, field.defaultValue)
      : values;
  }, { ...defaultValue });
}

export function mapFormValues(values = {}, schema = [], mapper) {
  if (typeof mapper === 'function') {
    return mapper(values, schema);
  }

  return schema.reduce((nextValues, field) => {
    if (!field?.name || typeof field.mapValue !== 'function') {
      return nextValues;
    }

    const currentValue = getValueByPath(nextValues, field.name);
    return setValueByPath(
      nextValues,
      field.name,
      field.mapValue(currentValue, nextValues)
    );
  }, { ...values });
}
