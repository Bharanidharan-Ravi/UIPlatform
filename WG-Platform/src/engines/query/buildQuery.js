const shouldIncludeValue = (value, includeEmpty) =>
  value !== undefined && value !== null && (includeEmpty || value !== '');

export function buildQuery(params = {}, options = {}) {
  const { arrayFormat = 'repeat', includeEmpty = false } = options;
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (!shouldIncludeValue(value, includeEmpty)) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((entry) => {
        if (!shouldIncludeValue(entry, includeEmpty)) {
          return;
        }

        if (arrayFormat === 'comma') {
          return;
        }

        searchParams.append(key, String(entry));
      });

      if (arrayFormat === 'comma' && value.length > 0) {
        searchParams.set(key, value.map(String).join(','));
      }

      return;
    }

    searchParams.set(key, String(value));
  });

  return searchParams.toString();
}

export function buildQueryString(params = {}, options = {}) {
  const query = buildQuery(params, options);
  return query ? `?${query}` : '';
}
