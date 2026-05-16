const serializeSort = (sort = []) =>
  sort
    .filter((entry) => entry?.field)
    .map((entry) => `${entry.field}:${entry.direction || 'asc'}`)
    .join(',');

export function translateListStateToQuery(state = {}) {
  const filters = Object.entries(state.filters || {}).reduce(
    (query, [key, value]) => {
      query[`filter.${key}`] = value;
      return query;
    },
    {}
  );

  return {
    page: state.page,
    pageSize: state.pageSize,
    search: state.search,
    sort: serializeSort(state.sort),
    ...filters
  };
}

export function useQueryTranslator(state) {
  return translateListStateToQuery(state);
}
