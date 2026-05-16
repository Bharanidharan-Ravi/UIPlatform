import { parseQuery } from '../query/parseQuery.js';

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseSort = (value) => {
  if (!value) {
    return [];
  }

  return String(value)
    .split(',')
    .filter(Boolean)
    .map((entry) => {
      const [field, direction = 'asc'] = entry.split(':');
      return { field, direction };
    });
};

export function parseListQuery(input = '') {
  const query = typeof input === 'string' ? parseQuery(input) : input;
  const filters = {};

  Object.entries(query || {}).forEach(([key, value]) => {
    if (key.startsWith('filter.')) {
      filters[key.replace('filter.', '')] = value;
    }
  });

  return {
    page: toNumber(query.page, 0),
    pageSize: toNumber(query.pageSize, 25),
    sort: parseSort(query.sort),
    search: query.search || '',
    filters
  };
}

export function useQueryParser(input) {
  return parseListQuery(input);
}
